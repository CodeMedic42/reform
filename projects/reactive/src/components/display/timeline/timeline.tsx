import React, { useMemo } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Input data for a single moment (node) in the timeline.
 * Moments are ordered newest-first in the array.
 */
interface Moment {
    /** Unique identifier for this moment */
    id: string;
    /**
     * The primary parent of this moment. Determines lane inheritance:
     * the primary parent is placed on the same lane as this moment.
     * Only ONE child may claim a given moment as its primary parent.
     */
    parent?: string | null;
    /**
     * Additional (non-primary) parent connections. Create visual merge/branch
     * curves but do NOT affect lane inheritance.
     */
    ancillaryParents?: string[];
}

/**
 * A connection from a moment to an ancillary parent on a higher lane.
 * Rendered as a curve coming down from the parent's lane.
 */
interface MergeConnection {
    parentId: string;
    lane: number;
}

/**
 * A connection arriving at a moment's row from a routing lane or
 * extended child lane. Used for routed branches (two-part connections)
 * and relocated merges (curve at parent's row instead of child's).
 */
interface IncomingConnection {
    /** The lane the vertical line arrives from */
    lane: number;
    /** true = line enters from above (y=0), false = from below (y=20) */
    fromAbove: boolean;
    /** true = the incoming lane ends here (no moments on it below this row) */
    terminates: boolean;
}

/**
 * A fully processed moment with all rendering data computed.
 */
interface ProcessedMoment extends Moment {
    /** The horizontal lane (column) this moment is rendered in. Lane 0 is leftmost. */
    lane: number;
    /**
     * Lane numbers of children that branch off from this moment.
     * Rendered as curves going upward from this moment's circle.
     */
    branches: number[];
    /**
     * Ancillary parent connections where the parent is on a higher lane number.
     * Rendered as curves on this moment's row coming down from the parent's lane.
     */
    mergesFromAbove: MergeConnection[];
    /**
     * Connections arriving at this moment's row from a routing lane or
     * extended child lane. Rendered as curves from the incoming lane
     * to this moment's circle.
     */
    incomingConnections: IncomingConnection[];
    /** Snapshot of active lanes at this moment's row. */
    activeLanes: boolean[];
    /**
     * Merge lanes that were already active before the merge — these need full
     * through-lines because they continue past this moment in both directions.
     */
    passThroughMerges: number[];
    /**
     * Branch lanes that continue below this moment — these need full
     * through-lines because the lane has moments further down.
     */
    passThroughBranches: number[];
    /**
     * Incoming connection lanes that were already active — these need full
     * through-lines because they continue past this moment in both directions.
     */
    passThroughIncoming: number[];
    /** Whether this moment's lane was active in the row above. */
    hasLineAbove: boolean;
    /** Whether this moment's lane is active in the row below. */
    hasLineBelow: boolean;
}

interface TimelineProps {
    moments?: Moment[];
    renderMoment: (moment: Moment, index: number) => React.ReactNode;
    /** Palette color names (e.g., ['blue', 'purple', 'green']). Applied as
     *  CSS classes `ra-clr-plt-{name}` which provide `--clr-plt-*` custom properties. */
    colors: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Horizontal pixel width of each lane column */
const LANE_WIDTH = 12;
/** X offset from the left edge of a lane to its center (where lines and circles draw) */
const LANE_CENTER = LANE_WIDTH / 2;
/** CSS custom property for line stroke color (palette shade 400) */
const LINE_STROKE = 'var(--clr-plt-400)';
/** CSS custom property for circle fill color (palette shade 600) */
const CIRCLE_FILL = 'var(--clr-plt-600)';

// =============================================================================
// SVG HELPERS
// =============================================================================

/**
 * Creates an SVG mask that cuts out a circle around the moment's dot,
 * preventing through-lines and curves from drawing over it.
 * Must use maskUnits="userSpaceOnUse" with explicit dimensions for cross-browser compatibility.
 */
function buildCutoutMask(id: string, offset: number = 0, width: number = LANE_WIDTH) {
    return (
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height="20">
            <rect x="0" y="0" width={width} height="20" fill="white" />
            <circle cx={offset + LANE_CENTER} cy="10" r="6" fill="black" />
        </mask>
    );
}

// =============================================================================
// DATA PROCESSING
// =============================================================================

/**
 * Processes raw moments into ProcessedMoments with lane assignments,
 * branch/merge connections, and active lane tracking.
 *
 * Pass 1:   Lane assignment — assigns lanes, handles primary vs ancillary priority
 * Compact:  Removes gaps in lane numbering left by freed-then-unused lanes
 * Pass 1.5: Collision detection — detects connections whose lines pass through
 *           intervening moments. Fixes via rerouting (use the other endpoint's
 *           lane), relocating (move merge curve to parent's row), or as a last
 *           resort, shifting lanes to insert a routing lane.
 * Pass 2:   Build & compute — creates entries, classifies connections, computes
 *           branches, merges, incoming connections, active lanes,
 *           pass-through sets, and hasLineAbove
 * Pass 3:   hasLineBelow — requires next moment's activeLanes snapshot
 */
function processMoments(moments: Moment[]): ProcessedMoment[] {
    // =====================================================================
    // PASS 1: Lane Assignment (top-to-bottom, newest to oldest)
    //
    // Lane inheritance rules:
    // - A moment's primary parent inherits the moment's lane (same column).
    // - Ancillary parents get new lanes.
    // - Primary assignments supersede earlier ancillary assignments.
    // - If two children claim the same primary parent, the second is warned
    //   and its primary is demoted to ancillary.
    // =====================================================================

    const laneMap: Record<string, number> = {};
    const assignedBy: Record<string, 'primary' | 'merge'> = {};
    const demotedPrimary: Record<string, string> = {};
    const freeLanes: number[] = [];
    let nextLane = 0;

    function allocLane(): number {
        return freeLanes.length > 0 ? freeLanes.pop()! : nextLane++;
    }

    function reassignLane(id: string, oldLane: number, newLane: number) {
        laneMap[id] = newLane;
        assignedBy[id] = 'primary';
        freeLanes.push(oldLane);
    }

    for (let i = 0; i < moments.length; i++) {
        const moment = moments[i];
        const primaryParent = moment.parent;
        const ancillaryParents = moment.ancillaryParents || [];

        if (laneMap[moment.id] === undefined) {
            laneMap[moment.id] = allocLane();
        }
        const lane = laneMap[moment.id];

        // Process primary parent
        if (primaryParent) {
            if (laneMap[primaryParent] === undefined) {
                laneMap[primaryParent] = lane;
                assignedBy[primaryParent] = 'primary';
            } else if (assignedBy[primaryParent] === 'primary' && laneMap[primaryParent] !== lane) {
                console.warn(`Moment "${moment.id}": primary parent "${primaryParent}" was already claimed as primary by another child. Treating as ancillary.`);
                demotedPrimary[moment.id] = primaryParent;
            } else if (assignedBy[primaryParent] === 'merge') {
                if (laneMap[primaryParent] !== lane) {
                    reassignLane(primaryParent, laneMap[primaryParent], lane);
                } else {
                    assignedBy[primaryParent] = 'primary';
                }
            }
        }

        // Process ancillary parents
        for (const ancParentId of ancillaryParents) {
            if (laneMap[ancParentId] === undefined) {
                laneMap[ancParentId] = allocLane();
                assignedBy[ancParentId] = 'merge';
            }
        }
    }

    // Compact lanes: remove gaps in lane numbering caused by lanes that
    // were freed during reassignment but never permanently occupied.
    const usedLanes = new Set(Object.values(laneMap));
    const sortedUsed = [...usedLanes].sort((a, b) => a - b);
    const compactMap: Record<number, number> = {};
    for (let i = 0; i < sortedUsed.length; i++) {
        compactMap[sortedUsed[i]] = i;
    }
    if (sortedUsed.some((lane, i) => lane !== i)) {
        for (const id of Object.keys(laneMap)) {
            laneMap[id] = compactMap[laneMap[id]];
        }
    }

    // =====================================================================
    // PASS 1.5: Collision Detection & Resolution
    //
    // Detects connections whose visual lines pass through intervening
    // moments on the same lane. Three resolution strategies:
    //
    // 1. Rerouted branch: child's lane has collision but parent's lane
    //    is clear → use parent's lane instead. Adds an incoming
    //    connection at the child's row from the parent's lane.
    //
    // 2. Relocated merge: parent's lane has collision but child's lane
    //    is clear → extend child's lane to the parent's row. Adds an
    //    incoming connection at the parent's row from the child's lane.
    //
    // 3. Routing lane (last resort): both lanes blocked → shift all
    //    lanes >= child's lane right by 1 to insert an empty routing
    //    lane. Two-part connection: branch at parent's row to the
    //    routing lane, incoming at child's row from the routing lane.
    // =====================================================================

    const momentIndex: Record<string, number> = {};
    for (let i = 0; i < moments.length; i++) {
        momentIndex[moments[i].id] = i;
    }

    // Collect all cross-lane connections
    interface ConnectionInfo {
        childId: string;
        parentId: string;
        childIndex: number;
        parentIndex: number;
    }

    const connections: ConnectionInfo[] = [];
    for (const moment of moments) {
        const effectiveAncillary = [...(moment.ancillaryParents || [])];
        let effectivePrimary: string | null | undefined = moment.parent;
        if (demotedPrimary[moment.id]) {
            effectiveAncillary.unshift(demotedPrimary[moment.id]);
            effectivePrimary = null;
        }

        for (const parentId of effectiveAncillary) {
            if (laneMap[parentId] !== undefined && laneMap[parentId] !== laneMap[moment.id]) {
                connections.push({
                    childId: moment.id,
                    parentId,
                    childIndex: momentIndex[moment.id],
                    parentIndex: momentIndex[parentId],
                });
            }
        }

        if (effectivePrimary && laneMap[effectivePrimary] !== undefined
            && laneMap[effectivePrimary] !== laneMap[moment.id]) {
            connections.push({
                childId: moment.id,
                parentId: effectivePrimary,
                childIndex: momentIndex[moment.id],
                parentIndex: momentIndex[effectivePrimary],
            });
        }
    }

    /** Returns true if any moment between indexA and indexB sits on connectingLane. */
    function hasCollision(connectingLane: number, indexA: number, indexB: number): boolean {
        const minIdx = Math.min(indexA, indexB);
        const maxIdx = Math.max(indexA, indexB);
        for (let i = minIdx + 1; i < maxIdx; i++) {
            if (laneMap[moments[i].id] === connectingLane) return true;
        }
        return false;
    }

    /** Shifts all lanes >= fromLane right by 1, opening fromLane as a routing lane. */
    function shiftLanes(fromLane: number) {
        for (const id of Object.keys(laneMap)) {
            if (laneMap[id] >= fromLane) {
                laneMap[id] += 1;
            }
        }
    }

    // Collision resolution tracking (keyed by "childId:parentId"):
    // - routedConnections: maps to routing lane number (strategy 3)
    // - reroutedBranches: branches using parent's lane instead (strategy 1)
    // - relocatedMerges: merges with curve moved to parent's row (strategy 2)
    // - incomingMap: incoming connections to add to target moments
    const routedConnections: Record<string, number> = {};
    const reroutedBranches: Set<string> = new Set();
    const relocatedMerges: Set<string> = new Set();
    const incomingMap: Record<string, IncomingConnection[]> = {};

    function addIncoming(momentId: string, lane: number, fromAbove: boolean) {
        if (!incomingMap[momentId]) incomingMap[momentId] = [];
        incomingMap[momentId].push({ lane, fromAbove, terminates: false });
    }

    // Process branch collisions
    // Try parent's lane first; only shift if both lanes are blocked
    let changed = true;
    while (changed) {
        changed = false;
        for (const conn of connections) {
            const childLane = laneMap[conn.childId];
            const parentLane = laneMap[conn.parentId];
            const key = `${conn.childId}:${conn.parentId}`;

            if (routedConnections[key] !== undefined || reroutedBranches.has(key)) continue;

            // Branch: parent on lower lane, child on higher lane
            if (parentLane < childLane) {
                if (hasCollision(childLane, conn.childIndex, conn.parentIndex)) {
                    if (!hasCollision(parentLane, conn.childIndex, conn.parentIndex)) {
                        // Parent's lane is clear — use it instead
                        reroutedBranches.add(key);
                        addIncoming(conn.childId, parentLane, false);
                    } else {
                        // Both lanes blocked — fall back to routing lane shift
                        const routingLane = childLane;
                        shiftLanes(childLane);
                        routedConnections[key] = routingLane;
                        addIncoming(conn.childId, routingLane, false);
                        changed = true;
                        break;
                    }
                }
            }
        }
    }

    // Process merge collisions (relocate curve to parent's row)
    for (const conn of connections) {
        const childLane = laneMap[conn.childId];
        const parentLane = laneMap[conn.parentId];
        const key = `${conn.childId}:${conn.parentId}`;

        if (routedConnections[key] !== undefined) continue;

        // Merge: parent on higher lane
        if (parentLane > childLane) {
            if (hasCollision(parentLane, conn.childIndex, conn.parentIndex)) {
                relocatedMerges.add(key);
                addIncoming(conn.parentId, childLane, true);
            }
        }
    }

    // Compute the last row index where each lane is needed. Starts with
    // the last actual moment on each lane, then extended for:
    // - Routing lane endpoints (routing lane active until the parent's row)
    // - Relocated merges (child's lane active until the parent's row)
    // - Normal branches (child's lane active until the furthest parent's row)
    // Used to control branch deactivation and through-line rendering.
    const lastMomentIndexOnLane: Record<number, number> = {};
    for (let i = 0; i < moments.length; i++) {
        const lane = laneMap[moments[i].id];
        lastMomentIndexOnLane[lane] = i;
    }

    // Routing lanes end at the parent's index
    for (const [key, routingLane] of Object.entries(routedConnections)) {
        const parentId = key.split(':')[1];
        const parentIdx = momentIndex[parentId];
        lastMomentIndexOnLane[routingLane] = Math.max(
            lastMomentIndexOnLane[routingLane] || 0, parentIdx
        );
    }

    // Relocated merges extend the child's lane to the parent's index
    for (const key of relocatedMerges) {
        const [childId, parentId] = key.split(':');
        const childLane = laneMap[childId];
        const parentIdx = momentIndex[parentId];
        lastMomentIndexOnLane[childLane] = Math.max(
            lastMomentIndexOnLane[childLane] || 0, parentIdx
        );
    }

    // Normal branches extend the child's lane to the parent's index.
    // When multiple branches share a lane (e.g., CC→I and CC→K both
    // branch to CC's lane), the lane must stay active until the
    // furthest parent.
    for (const conn of connections) {
        const key = `${conn.childId}:${conn.parentId}`;
        if (routedConnections[key] !== undefined) continue;
        if (reroutedBranches.has(key)) continue;
        if (relocatedMerges.has(key)) continue;

        const childLane = laneMap[conn.childId];
        const parentLane = laneMap[conn.parentId];

        if (parentLane < childLane) {
            lastMomentIndexOnLane[childLane] = Math.max(
                lastMomentIndexOnLane[childLane] || 0, conn.parentIndex
            );
        }
    }

    // Compute terminates for incoming connections now that
    // lastMomentIndexOnLane includes routing endpoints and extensions
    for (const [momentId, conns] of Object.entries(incomingMap)) {
        const targetIndex = momentIndex[momentId];
        for (const conn of conns) {
            const last = lastMomentIndexOnLane[conn.lane];
            conn.terminates = last === undefined || last <= targetIndex;
        }
    }

    // =====================================================================
    // PASS 2: Build entries, classify connections, compute branches,
    //         active lanes, passThroughMerges, and hasLineAbove
    // =====================================================================

    const lookup: Record<string, ProcessedMoment> = {};
    const currentActiveLanes: boolean[] = [];

    // Pre-create all entries so branches can be pushed to parent moments
    // (parents appear later in the array but need their entry to exist)
    for (const moment of moments) {
        lookup[moment.id] = {
            ...moment,
            lane: laneMap[moment.id],
            branches: [],
            mergesFromAbove: [],
            incomingConnections: incomingMap[moment.id] || [],
            activeLanes: [],
            passThroughMerges: [],
            passThroughBranches: [],
            passThroughIncoming: [],
            hasLineAbove: false,
            hasLineBelow: false,
        };
    }

    for (let i = 0; i < moments.length; i++) {
        const moment = moments[i];
        const processed = lookup[moment.id];
        const lane = processed.lane;

        // Determine effective parents (accounting for demoted primaries)
        let effectivePrimary = moment.parent;
        const effectiveAncillary = [...(moment.ancillaryParents || [])];

        if (demotedPrimary[moment.id]) {
            effectiveAncillary.unshift(demotedPrimary[moment.id]);
            effectivePrimary = null;
        }

        // Classify ancillary connections by direction
        for (const ancParentId of effectiveAncillary) {
            const parentLane = laneMap[ancParentId];
            const connKey = `${moment.id}:${ancParentId}`;

            if (parentLane !== undefined && parentLane !== lane) {
                if (routedConnections[connKey] !== undefined) {
                    // Routed branch: parent gets branch to routing lane
                    const routingLane = routedConnections[connKey];
                    if (lookup[ancParentId]) {
                        lookup[ancParentId].branches.push(routingLane);
                    }
                } else if (reroutedBranches.has(connKey) || relocatedMerges.has(connKey)) {
                    // Rerouted: skip (handled by incoming on target moment)
                } else if (parentLane > lane) {
                    processed.mergesFromAbove.push({ parentId: ancParentId, lane: parentLane });
                } else if (lookup[ancParentId]) {
                    lookup[ancParentId].branches.push(lane);
                }
            }
        }

        // Primary parent on different lane → branch on parent
        if (effectivePrimary && laneMap[effectivePrimary] !== undefined) {
            const parentLane = laneMap[effectivePrimary];
            const connKey = `${moment.id}:${effectivePrimary}`;

            if (parentLane !== lane && lookup[effectivePrimary]) {
                if (routedConnections[connKey] !== undefined) {
                    const routingLane = routedConnections[connKey];
                    lookup[effectivePrimary].branches.push(routingLane);
                } else if (!reroutedBranches.has(connKey)) {
                    lookup[effectivePrimary].branches.push(lane);
                }
            }
        }

        // --- Active lanes tracking ---

        currentActiveLanes[lane] = true;

        // Activate merge lanes; detect pass-throughs (already active before merge)
        processed.passThroughMerges = [];
        for (const conn of processed.mergesFromAbove) {
            if (currentActiveLanes[conn.lane]) {
                processed.passThroughMerges.push(conn.lane);
            }
            currentActiveLanes[conn.lane] = true;
        }

        // Activate incoming connection lanes; detect pass-throughs
        processed.passThroughIncoming = [];
        for (const conn of processed.incomingConnections) {
            if (currentActiveLanes[conn.lane]) {
                processed.passThroughIncoming.push(conn.lane);
            }
            currentActiveLanes[conn.lane] = true;
        }

        // Snapshot active lanes for this row's rendering
        processed.activeLanes = [...currentActiveLanes];

        // hasLineAbove: was this lane active in the previous row?
        if (i > 0) {
            const prevActiveLanes = lookup[moments[i - 1].id].activeLanes;
            processed.hasLineAbove = !!prevActiveLanes[lane];
        }

        // Identify pass-through branches: branch lanes that have moments
        // below this row and thus need full through-lines.
        processed.passThroughBranches = processed.branches.filter(
            branchLane => lastMomentIndexOnLane[branchLane] > i
        );

        // Deactivate branch lanes that end here (no moments below use them).
        for (const branchLane of processed.branches) {
            if (lastMomentIndexOnLane[branchLane] <= i) {
                currentActiveLanes[branchLane] = false;
            }
        }

        // Deactivate incoming lanes that terminate here (fromAbove connections)
        for (const conn of processed.incomingConnections) {
            if (conn.fromAbove && lastMomentIndexOnLane[conn.lane] <= i) {
                currentActiveLanes[conn.lane] = false;
            }
        }
    }

    // =====================================================================
    // PASS 3: Compute hasLineBelow
    // Requires the next moment's activeLanes snapshot, which wasn't
    // available during pass 2.
    // =====================================================================

    for (let i = 0; i < moments.length - 1; i++) {
        const processed = lookup[moments[i].id];
        const nextActiveLanes = lookup[moments[i + 1].id].activeLanes;
        processed.hasLineBelow = !!nextActiveLanes[processed.lane];
    }

    return moments.map(m => lookup[m.id]);
}

// =============================================================================
// MOMENT NODE COMPONENT
// =============================================================================

interface MomentNodeProps {
    moment: ProcessedMoment;
    index: number;
    getLaneClass: (laneIndex: number) => string;
}

/**
 * Renders the SVG node column for a single moment row.
 *
 * Uses two SVGs stacked vertically:
 * 1. Static SVG (fixed 20px) — curves, through-lines, mask, and circle in a
 *    fixed viewBox so curves stay crisp.
 * 2. Variable SVG (flex: 1) — straight through-lines with preserveAspectRatio="none"
 *    that stretch to fill any extra row height from taller content.
 */
function MomentNode({ moment, index, getLaneClass }: MomentNodeProps) {
    const { lane, branches, mergesFromAbove, incomingConnections, activeLanes,
        passThroughMerges, passThroughBranches, passThroughIncoming,
        hasLineAbove, hasLineBelow } = moment;

    const mergeLanes = mergesFromAbove.map(c => c.lane);
    const incomingLanes = incomingConnections.map(c => c.lane);
    const offset = lane * LANE_WIDTH;
    const maxLane = Math.max(lane, ...branches, ...mergeLanes, ...incomingLanes, activeLanes.length - 1);
    const svgWidth = (maxLane + 1) * LANE_WIDTH;
    const maskId = `cutout-${index}`;

    // Render highest-lane-first so lower lanes draw on top
    const sortedBranches = [...branches].sort((a, b) => b - a);

    return (
        <div
            className="ra-timeline-moment-node-container"
            style={{ width: svgWidth, minHeight: 20, display: 'flex', flexDirection: 'column' }}
        >
            {/* Static SVG: fixed 20px height with all complex graphics */}
            <svg
                width={svgWidth}
                height="20"
                viewBox={`0 0 ${svgWidth} 20`}
                style={{ display: 'block', flexShrink: 0 }}
            >
                <defs>
                    {buildCutoutMask(maskId, offset, svgWidth)}
                </defs>

                {/* Masked group: prevents lines/curves from drawing over the circle */}
                <g mask={`url(#${maskId})`}>

                    {/* Through-lines: vertical lines for lanes passing through this row.
                        Skipped for branch/merge lanes (curve handles the connection)
                        unless the lane is a pass-through that continues both directions. */}
                    {activeLanes.map((active, laneIndex) => {
                        if (!active) return null;
                        const isOwnLane = laneIndex === lane;
                        const isBranch = branches.includes(laneIndex);
                        const isMerge = mergeLanes.includes(laneIndex);
                        const isIncoming = incomingLanes.includes(laneIndex);
                        const isPassThrough = passThroughMerges.includes(laneIndex)
                            || passThroughBranches.includes(laneIndex)
                            || passThroughIncoming.includes(laneIndex);

                        if (isOwnLane && !hasLineAbove && !hasLineBelow) return null;

                        let y1 = "0";
                        let y2 = "20";
                        if (isOwnLane && !hasLineAbove) y1 = "10";
                        if (isOwnLane && !hasLineBelow) y2 = "10";

                        if ((isBranch || isMerge || isIncoming) && !isPassThrough) return null;

                        // Terminating incoming: skip through-line even if
                        // pass-through — the curve handles the visual and
                        // the lane doesn't continue below.
                        if (isIncoming && incomingConnections.some(
                            c => c.lane === laneIndex && c.terminates
                        )) return null;
                        if (y1 === y2) return null;

                        return (
                            <g key={`through-${laneIndex}`} className={getLaneClass(laneIndex)}>
                                <line
                                    x1={laneIndex * LANE_WIDTH + LANE_CENTER}
                                    y1={y1}
                                    x2={laneIndex * LANE_WIDTH + LANE_CENTER}
                                    y2={y2}
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                />
                            </g>
                        );
                    })}

                    {/* Branch curves: from this moment's circle (y=10) upward to
                        the branch lane (y=0). Horizontal bridge added when > 1 lane away. */}
                    {sortedBranches.map((branchLane) => {
                        const curveStartX = (branchLane - 1) * LANE_WIDTH + LANE_CENTER;
                        const curveEndX = branchLane * LANE_WIDTH + LANE_CENTER;

                        return (
                            <g key={`branch-${branchLane}`} className={getLaneClass(branchLane)}>
                                {branchLane - lane > 1 && (
                                    <line
                                        x1={offset + LANE_CENTER}
                                        y1="10"
                                        x2={curveStartX}
                                        y2="10"
                                        stroke={LINE_STROKE}
                                        strokeWidth="2"
                                    />
                                )}
                                <path
                                    d={`M ${curveStartX},10 Q ${curveEndX},10 ${curveEndX},0`}
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </g>
                        );
                    })}

                    {/* Merge curves from above: come down from the parent's lane (y=20)
                        and turn toward this moment's circle. Rendered highest-first. */}
                    {[...mergesFromAbove].sort((a, b) => b.lane - a.lane).map((conn) => {
                        const mergeLane = conn.lane;
                        const curveStartX = mergeLane * LANE_WIDTH + LANE_CENTER;
                        const curveEndX = (mergeLane - 1) * LANE_WIDTH + LANE_CENTER;

                        return (
                            <g key={`merge-above-${mergeLane}`} className={getLaneClass(mergeLane)}>
                                <path
                                    d={`M ${curveStartX},20 Q ${curveStartX},10 ${curveEndX},10`}
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {mergeLane - lane > 1 && (
                                    <line
                                        x1={curveEndX}
                                        y1="10"
                                        x2={offset + LANE_CENTER}
                                        y2="10"
                                        stroke={LINE_STROKE}
                                        strokeWidth="2"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Incoming connections: curves from routing lanes or extended child
                        lanes arriving at this moment's circle. */}
                    {incomingConnections.map((conn) => {
                        const incLane = conn.lane;
                        const incX = incLane * LANE_WIDTH + LANE_CENTER;
                        const startY = conn.fromAbove ? 0 : 20;
                        // Adjacent lane: one step toward this moment's lane
                        const adjacentLane = incLane < lane ? incLane + 1 : incLane - 1;
                        const adjacentX = adjacentLane * LANE_WIDTH + LANE_CENTER;

                        return (
                            <g key={`incoming-${incLane}`} className={getLaneClass(incLane)}>
                                <path
                                    d={`M ${incX},${startY} Q ${incX},10 ${adjacentX},10`}
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    fill="none"
                                />
                                {Math.abs(incLane - lane) > 1 && (
                                    <line
                                        x1={adjacentX}
                                        y1="10"
                                        x2={offset + LANE_CENTER}
                                        y2="10"
                                        stroke={LINE_STROKE}
                                        strokeWidth="2"
                                    />
                                )}
                            </g>
                        );
                    })}
                </g>

                <title>{moment.id}</title>

                {/* Circle rendered outside the mask so it draws on top */}
                <g className={getLaneClass(lane)}>
                    <circle cx={offset + LANE_CENTER} cy="10" r="4" fill={CIRCLE_FILL} />
                </g>
            </svg>

            {/* Variable SVG: straight through-lines that stretch to fill extra row height.
                Uses preserveAspectRatio="none" so lines extend with the content. */}
            <svg
                viewBox={`0 0 ${svgWidth} 20`}
                preserveAspectRatio="none"
                style={{ display: 'block', flex: 1, width: svgWidth }}
            >
                {activeLanes.map((active, laneIndex) => {
                    if (!active) return null;
                    if (branches.includes(laneIndex) && !passThroughBranches.includes(laneIndex)) return null;
                    // Incoming lanes that terminate here have no through-line below
                    const isTerminating = incomingConnections.some(
                        c => c.lane === laneIndex && c.terminates
                    );
                    if (isTerminating) return null;
                    if (laneIndex === lane && !hasLineBelow) return null;
                    return (
                        <g key={`var-${laneIndex}`} className={getLaneClass(laneIndex)}>
                            <line
                                x1={laneIndex * LANE_WIDTH + LANE_CENTER}
                                y1="0"
                                x2={laneIndex * LANE_WIDTH + LANE_CENTER}
                                y2="20"
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                            />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// =============================================================================
// TIMELINE COMPONENT
// =============================================================================

function Timeline(props: TimelineProps) {
    const {
        moments = [],
        renderMoment,
        colors = [],
    } = props;

    const processedMoments = useMemo(() => processMoments(moments), [moments]);

    function getLaneClass(laneIndex: number) {
        return `ra-clr-plt-${colors[laneIndex % colors.length]}`;
    }

    return (
        <div className="ra-timeline">
            {processedMoments.map((moment, index) => (
                <div
                    key={moment.id}
                    className="ra-timeline-step"
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
                >
                    <MomentNode moment={moment} index={index} getLaneClass={getLaneClass} />
                    <div className="ra-timeline-moment-content">
                        {renderMoment(moment, index)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Timeline;
