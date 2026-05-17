import React, { useMemo, useRef } from 'react';
import classNames from 'classnames';
import TimelineEvent from './timeline-event.js';

import type { TimelineEventType, IncomingConnectionType, ProcessedEventType } from './timeline-types.js';

export interface TimelineProps {
    events?: TimelineEventType[];
    renderEvent?: (event: TimelineEventType, index: number) => React.ReactNode;
    /** When true, content from renderEvent is initially hidden and can be
     *  toggled open/closed by clicking or pressing Enter on the header row. */
    expandable?: boolean;
    /** Palette color names (e.g., ['blue', 'purple', 'green']). Applied as
     *  CSS classes `ra-clr-plt-{name}` which provide `--clr-plt-*` custom properties. */
    colors: string[];
}

/**
 * Processes raw events into ProcessedEvents with lane assignments,
 * branch/merge connections, and active lane tracking.
 *
 * Pass 1:   Lane assignment — assigns lanes, handles primary vs ancillary priority
 * Compact:  Removes gaps in lane numbering left by freed-then-unused lanes
 * Pass 1.5: Collision detection — detects connections whose lines pass through
 *           intervening events. Fixes via rerouting (use the other endpoint's
 *           lane), relocating (move merge curve to parent's row), or as a last
 *           resort, shifting lanes to insert a routing lane.
 * Pass 2:   Build & compute — creates entries, classifies connections, computes
 *           branches, merges, incoming connections, active lanes,
 *           pass-through sets, and hasLineAbove
 * Pass 3:   hasLineBelow — requires next event's activeLanes snapshot
 */
function processEvents(events: TimelineEventType[]): ProcessedEventType[] {
    // =====================================================================
    // PASS 1: Lane Assignment (top-to-bottom, newest to oldest)
    //
    // Lane inheritance rules:
    // - An event's primary parent inherits the event's lane (same column).
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

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const primaryParent = event.parent;
        const ancillaryParents = event.ancillaryParents || [];

        if (laneMap[event.id] === undefined) {
            laneMap[event.id] = allocLane();
        }
        const lane = laneMap[event.id];

        // Process primary parent
        if (primaryParent) {
            if (laneMap[primaryParent] === undefined) {
                laneMap[primaryParent] = lane;
                assignedBy[primaryParent] = 'primary';
            } else if (assignedBy[primaryParent] === 'primary' && laneMap[primaryParent] !== lane) {
                console.warn(`Event "${event.id}": primary parent "${primaryParent}" was already claimed as primary by another child. Treating as ancillary.`);
                demotedPrimary[event.id] = primaryParent;
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

    // Build event index lookup (used by compaction, collapsing, and
    // collision detection below).
    const eventIndex: Record<string, number> = {};
    for (let i = 0; i < events.length; i++) {
        eventIndex[events[i].id] = i;
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

    // Collapse lanes: merge non-overlapping lanes into the same column
    // to minimize graph width (interval graph coloring). Two lanes can
    // share a column if their active row ranges don't overlap.
    const laneRanges: Record<number, [number, number]> = {};
    for (let i = 0; i < events.length; i++) {
        const lane = laneMap[events[i].id];
        if (laneRanges[lane] === undefined) {
            laneRanges[lane] = [i, i];
        } else {
            laneRanges[lane][0] = Math.min(laneRanges[lane][0], i);
            laneRanges[lane][1] = Math.max(laneRanges[lane][1], i);
        }
    }

    // Extend ranges for cross-lane connections: branches extend the
    // child's lane to the parent's row, merges extend the parent's
    // lane to the child's row.
    for (const event of events) {
        const childLane = laneMap[event.id];
        const childIdx = eventIndex[event.id];
        const parents = [...(event.ancillaryParents || [])];
        let effectivePrimary: string | null | undefined = event.parent;
        if (demotedPrimary[event.id]) {
            parents.unshift(demotedPrimary[event.id]);
            effectivePrimary = null;
        }
        if (effectivePrimary) parents.push(effectivePrimary);

        for (const parentId of parents) {
            const parentLane = laneMap[parentId];
            if (parentLane === undefined || parentLane === childLane) continue;
            const parentIdx = eventIndex[parentId];
            if (parentLane < childLane) {
                laneRanges[childLane][1] = Math.max(laneRanges[childLane][1], parentIdx);
            } else {
                laneRanges[parentLane][0] = Math.min(laneRanges[parentLane][0], childIdx);
            }
        }
    }

    // Greedy coloring: assign each lane to the lowest column whose
    // last active range ends before this lane's range starts.
    const sortedLanes = Object.keys(laneRanges).map(Number).sort(
        (a, b) => laneRanges[a][0] - laneRanges[b][0]
    );
    const columnEnds: number[] = [];
    const laneToColumn: Record<number, number> = {};

    for (const lane of sortedLanes) {
        const [start, end] = laneRanges[lane];
        let assigned = false;
        for (let col = 0; col < columnEnds.length; col++) {
            if (columnEnds[col] < start) {
                laneToColumn[lane] = col;
                columnEnds[col] = end;
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            laneToColumn[lane] = columnEnds.length;
            columnEnds.push(end);
        }
    }

    // Build per-lane active segments from the collapse mapping.
    // Collapsed lanes have multiple segments (one per original lane);
    // non-collapsed lanes have a single segment. Segments track
    // discontinuous active ranges so through-lines don't falsely bridge
    // independent sections sharing a column.
    const laneSegments: Record<number, [number, number][]> = {};
    for (const lane of sortedLanes) {
        const col = laneToColumn[lane];
        if (!laneSegments[col]) laneSegments[col] = [];
        laneSegments[col].push([laneRanges[lane][0], laneRanges[lane][1]]);
    }
    for (const col of Object.keys(laneSegments)) {
        laneSegments[Number(col)].sort((a, b) => a[0] - b[0]);
    }

    for (const id of Object.keys(laneMap)) {
        laneMap[id] = laneToColumn[laneMap[id]];
    }

    /** Returns the end index of the segment containing `index` on `lane`, or -1 if none. */
    function getSegmentEnd(lane: number, index: number): number {
        const segs = laneSegments[lane];
        if (!segs) return -1;
        for (const seg of segs) {
            if (index >= seg[0] && index <= seg[1]) return seg[1];
        }
        return -1;
    }

    /** Extends the segment on `lane` that contains `containingIndex` to reach `newEnd`.
     *  Creates a new segment if none contains the index. */
    function extendSegment(lane: number, containingIndex: number, newEnd: number) {
        if (!laneSegments[lane]) {
            laneSegments[lane] = [[containingIndex, newEnd]];
            return;
        }
        for (const seg of laneSegments[lane]) {
            if (containingIndex >= seg[0] && containingIndex <= seg[1]) {
                seg[1] = Math.max(seg[1], newEnd);
                return;
            }
        }
        laneSegments[lane].push([containingIndex, newEnd]);
        laneSegments[lane].sort((a, b) => a[0] - b[0]);
    }

    // =====================================================================
    // PASS 1.5: Collision Detection & Resolution
    //
    // Detects connections whose visual lines pass through intervening
    // events on the same lane. Three resolution strategies:
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

    // Collect all cross-lane connections
    interface ConnectionInfo {
        childId: string;
        parentId: string;
        childIndex: number;
        parentIndex: number;
    }

    const connections: ConnectionInfo[] = [];
    for (const event of events) {
        const effectiveAncillary = [...(event.ancillaryParents || [])];
        let effectivePrimary: string | null | undefined = event.parent;
        if (demotedPrimary[event.id]) {
            effectiveAncillary.unshift(demotedPrimary[event.id]);
            effectivePrimary = null;
        }

        for (const parentId of effectiveAncillary) {
            if (laneMap[parentId] !== undefined && laneMap[parentId] !== laneMap[event.id]) {
                connections.push({
                    childId: event.id,
                    parentId,
                    childIndex: eventIndex[event.id],
                    parentIndex: eventIndex[parentId],
                });
            }
        }

        if (effectivePrimary && laneMap[effectivePrimary] !== undefined
            && laneMap[effectivePrimary] !== laneMap[event.id]) {
            connections.push({
                childId: event.id,
                parentId: effectivePrimary,
                childIndex: eventIndex[event.id],
                parentIndex: eventIndex[effectivePrimary],
            });
        }
    }

    /** Returns true if any event between indexA and indexB sits on connectingLane. */
    function hasCollision(connectingLane: number, indexA: number, indexB: number): boolean {
        const minIdx = Math.min(indexA, indexB);
        const maxIdx = Math.max(indexA, indexB);
        for (let i = minIdx + 1; i < maxIdx; i++) {
            if (laneMap[events[i].id] === connectingLane) return true;
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
        // Shift segment keys in descending order to avoid key collisions
        const keys = Object.keys(laneSegments).map(Number).sort((a, b) => b - a);
        for (const lane of keys) {
            if (lane >= fromLane) {
                laneSegments[lane + 1] = laneSegments[lane];
                delete laneSegments[lane];
            }
        }
    }

    // Collision resolution tracking (keyed by "childId:parentId"):
    // - routedConnections: maps to routing lane number (strategy 3)
    // - reroutedBranches: branches using parent's lane instead (strategy 1)
    // - relocatedMerges: merges with curve moved to parent's row (strategy 2)
    // - incomingMap: incoming connections to add to target events
    const routedConnections: Record<string, number> = {};
    const reroutedBranches: Set<string> = new Set();
    const relocatedMerges: Set<string> = new Set();
    const incomingMap: Record<string, IncomingConnectionType[]> = {};

    function addIncoming(eventId: string, lane: number, fromAbove: boolean, otherEventId: string) {
        if (!incomingMap[eventId]) incomingMap[eventId] = [];
        incomingMap[eventId].push({ lane, fromAbove, terminates: false, otherEventId });
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
                        addIncoming(conn.childId, parentLane, false, conn.parentId);
                    } else {
                        // Both lanes blocked — fall back to routing lane shift
                        const routingLane = childLane;
                        shiftLanes(childLane);
                        routedConnections[key] = routingLane;
                        addIncoming(conn.childId, routingLane, false, conn.parentId);
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
                addIncoming(conn.parentId, childLane, true, conn.childId);
            }
        }
    }

    // Extend lane segments for connection endpoints. Each extension
    // grows the segment containing the child event to reach the
    // parent's row, ensuring through-lines span the full connection.

    // Routing lanes: create a new segment spanning child to parent
    for (const [key, routingLane] of Object.entries(routedConnections)) {
        const [childId, parentId] = key.split(':');
        const childIdx = eventIndex[childId];
        const parentIdx = eventIndex[parentId];
        extendSegment(routingLane, childIdx, parentIdx);
    }

    // Relocated merges: extend the child's lane segment to the parent's row
    for (const key of relocatedMerges) {
        const [childId, parentId] = key.split(':');
        const childLane = laneMap[childId];
        const childIdx = eventIndex[childId];
        const parentIdx = eventIndex[parentId];
        extendSegment(childLane, childIdx, parentIdx);
    }

    // Normal branches: extend the child's lane segment to the parent's row.
    // When multiple branches share a lane (e.g., CC→I and CC→K both
    // branch to CC's lane), the segment grows to the furthest parent.
    for (const conn of connections) {
        const key = `${conn.childId}:${conn.parentId}`;
        if (routedConnections[key] !== undefined) continue;
        if (reroutedBranches.has(key)) continue;
        if (relocatedMerges.has(key)) continue;

        const childLane = laneMap[conn.childId];
        const parentLane = laneMap[conn.parentId];

        if (parentLane < childLane) {
            extendSegment(childLane, conn.childIndex, conn.parentIndex);
        }
    }

    // Compute terminates for incoming connections using segment data
    for (const [eventId, conns] of Object.entries(incomingMap)) {
        const targetIndex = eventIndex[eventId];
        for (const conn of conns) {
            const segEnd = getSegmentEnd(conn.lane, targetIndex);
            conn.terminates = segEnd <= targetIndex;
        }
    }

    // =====================================================================
    // PASS 2: Build entries, classify connections, compute branches,
    //         active lanes, passThroughMerges, and hasLineAbove
    // =====================================================================

    const lookup: Record<string, ProcessedEventType> = {};
    const currentActiveLanes: boolean[] = [];

    // Pre-create all entries so branches can be pushed to parent events
    // (parents appear later in the array but need their entry to exist)
    for (const event of events) {
        lookup[event.id] = {
            ...event,
            lane: laneMap[event.id],
            branches: [],
            mergesFromAbove: [],
            incomingConnections: incomingMap[event.id] || [],
            activeLanes: [],
            passThroughMerges: [],
            passThroughBranches: [],
            passThroughIncoming: [],
            hasLineAbove: false,
            hasLineBelow: false,
            laneTopEvents: {},
            laneBottomEvents: {},
        };
    }

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const processed = lookup[event.id];
        const lane = processed.lane;

        // Determine effective parents (accounting for demoted primaries)
        let effectivePrimary = event.parent;
        const effectiveAncillary = [...(event.ancillaryParents || [])];

        if (demotedPrimary[event.id]) {
            effectiveAncillary.unshift(demotedPrimary[event.id]);
            effectivePrimary = null;
        }

        // Classify ancillary connections by direction
        for (const ancParentId of effectiveAncillary) {
            const parentLane = laneMap[ancParentId];
            const connKey = `${event.id}:${ancParentId}`;

            if (parentLane !== undefined && parentLane !== lane) {
                if (routedConnections[connKey] !== undefined) {
                    // Routed branch: parent gets branch to routing lane
                    const routingLane = routedConnections[connKey];
                    if (lookup[ancParentId]) {
                        lookup[ancParentId].branches.push({ lane: routingLane, childId: event.id });
                    }
                } else if (reroutedBranches.has(connKey) || relocatedMerges.has(connKey)) {
                    // Rerouted: skip (handled by incoming on target event)
                } else if (parentLane > lane) {
                    processed.mergesFromAbove.push({ parentId: ancParentId, lane: parentLane });
                } else if (lookup[ancParentId]) {
                    lookup[ancParentId].branches.push({ lane, childId: event.id });
                }
            }
        }

        // Primary parent on different lane → branch on parent
        if (effectivePrimary && laneMap[effectivePrimary] !== undefined) {
            const parentLane = laneMap[effectivePrimary];
            const connKey = `${event.id}:${effectivePrimary}`;

            if (parentLane !== lane && lookup[effectivePrimary]) {
                if (routedConnections[connKey] !== undefined) {
                    const routingLane = routedConnections[connKey];
                    lookup[effectivePrimary].branches.push({ lane: routingLane, childId: event.id });
                } else if (!reroutedBranches.has(connKey)) {
                    lookup[effectivePrimary].branches.push({ lane, childId: event.id });
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
        // For collapsed lanes, the previous snapshot may show the lane as
        // active (pre-deactivation) even though a segment gap exists. Check
        // that the previous row's segment actually reaches this row.
        if (i > 0) {
            const prevActiveLanes = lookup[events[i - 1].id].activeLanes;
            processed.hasLineAbove = !!prevActiveLanes[lane];
            if (processed.hasLineAbove && getSegmentEnd(lane, i - 1) < i) {
                processed.hasLineAbove = false;
            }
        }

        // Identify pass-through branches: branch lanes whose current
        // segment continues below this row.
        processed.passThroughBranches = processed.branches
            .map(b => b.lane)
            .filter(branchLane => getSegmentEnd(branchLane, i) > i);

        // Deactivate branch lanes whose current segment ends here.
        for (const { lane: branchLane } of processed.branches) {
            if (getSegmentEnd(branchLane, i) <= i) {
                currentActiveLanes[branchLane] = false;
            }
        }

        // Deactivate incoming lanes whose current segment ends here
        for (const conn of processed.incomingConnections) {
            if (conn.fromAbove && getSegmentEnd(conn.lane, i) <= i) {
                currentActiveLanes[conn.lane] = false;
            }
        }
    }

    // =====================================================================
    // PASS 3: Compute hasLineBelow
    // Requires the next event's activeLanes snapshot, which wasn't
    // available during pass 2.
    // =====================================================================

    for (let i = 0; i < events.length - 1; i++) {
        const processed = lookup[events[i].id];
        const nextActiveLanes = lookup[events[i + 1].id].activeLanes;
        processed.hasLineBelow = !!nextActiveLanes[processed.lane];
    }

    // =====================================================================
    // PASS 4: Compute laneTopEvents / laneBottomEvents via edge tracing.
    //
    // For each child-parent edge in the graph, determine the lane its
    // through-line travels along and the row range it covers, then mark each
    // row × lane × half (top/bottom) with the edge's endpoint IDs.
    //
    // This correctly attributes shared lane segments to ALL edges that
    // traverse them (e.g., when two children both branch to the same parent
    // via a shared lane, the segment between them carries both edges).
    // =====================================================================

    interface EdgeTrace {
        childId: string;
        parentId: string;
        lane: number;
        fromRow: number; // child row (smaller — newest-first ordering)
        toRow: number;   // parent row (larger — older)
        /** Skip lo-bottom attribution when this edge has a curve at lo; the
         *  curve already represents the edge's entry, and the through-line at
         *  lo belongs to the lane's other traffic. */
        skipLo: boolean;
        /** Same for the hi-top endpoint. */
        skipHi: boolean;
    }

    const edgeTraces: EdgeTrace[] = [];

    // Primary same-lane parent edges (not in the `connections` array, which
    // only tracks cross-lane connections). No curves at either end.
    for (const event of events) {
        const parentId = event.parent;
        if (!parentId) continue;
        const childLane = laneMap[event.id];
        const parentLane = laneMap[parentId];
        if (parentLane === undefined || childLane !== parentLane) continue;
        edgeTraces.push({
            childId: event.id,
            parentId,
            lane: childLane,
            fromRow: eventIndex[event.id],
            toRow: eventIndex[parentId],
            skipLo: false,
            skipHi: false,
        });
    }

    // Cross-lane edges — derive traversed lane and curve presence from
    // collision-resolution state.
    for (const conn of connections) {
        const key = `${conn.childId}:${conn.parentId}`;
        const childLane = laneMap[conn.childId];
        const parentLane = laneMap[conn.parentId];

        let traceLane: number;
        let skipLo: boolean;
        let skipHi: boolean;
        if (routedConnections[key] !== undefined) {
            // Routed via a dedicated routing lane: incoming curve at lo,
            // branch curve at hi. Both endpoints have curves.
            traceLane = routedConnections[key];
            skipLo = true;
            skipHi = true;
        } else if (reroutedBranches.has(key)) {
            // Through-line rides the parent's primary lane. Incoming curve at
            // lo (child's row); parent just sits on its own lane at hi.
            traceLane = parentLane;
            skipLo = true;
            skipHi = false;
        } else if (relocatedMerges.has(key)) {
            // Through-line extends child's lane to parent's row; incoming
            // curve at hi (parent's row). Child just sits on its own lane at lo.
            traceLane = childLane;
            skipLo = false;
            skipHi = true;
        } else if (parentLane < childLane) {
            // Normal branch: child sits on its own lane at lo; branch curve
            // at hi (parent's row).
            traceLane = childLane;
            skipLo = false;
            skipHi = true;
        } else {
            // Normal merge: merge curve at lo (child's row); parent sits on
            // its own lane at hi.
            traceLane = parentLane;
            skipLo = true;
            skipHi = false;
        }

        edgeTraces.push({
            childId: conn.childId,
            parentId: conn.parentId,
            lane: traceLane,
            fromRow: conn.childIndex,
            toRow: conn.parentIndex,
            skipLo,
            skipHi,
        });
    }

    function addEvents(row: number, lane: number, half: 'top' | 'bottom', ids: string[]) {
        const e = lookup[events[row].id];
        const target = half === 'top' ? e.laneTopEvents : e.laneBottomEvents;
        if (!target[lane]) target[lane] = [];
        for (const id of ids) {
            if (!target[lane].includes(id)) target[lane].push(id);
        }
    }

    for (const trace of edgeTraces) {
        const ids = [trace.childId, trace.parentId];
        const lo = Math.min(trace.fromRow, trace.toRow);
        const hi = Math.max(trace.fromRow, trace.toRow);
        if (lo === hi) continue;

        if (!trace.skipLo) addEvents(lo, trace.lane, 'bottom', ids);
        if (!trace.skipHi) addEvents(hi, trace.lane, 'top', ids);
        for (let r = lo + 1; r < hi; r++) {
            addEvents(r, trace.lane, 'top', ids);
            addEvents(r, trace.lane, 'bottom', ids);
        }
    }

    return events.map(m => lookup[m.id]);
}

function Timeline(props: TimelineProps) {
    const {
        events = [],
        renderEvent,
        expandable = false,
        colors = [],
    } = props;

    const processedEvents = useMemo(() => processEvents(events), [events]);

    const containerRef = useRef<HTMLDivElement>(null);
    const styleRef = useRef<HTMLStyleElement>(null);

    function getLaneClass(laneIndex: number) {
        return `ra-clr-plt-${colors[laneIndex % colors.length]}`;
    }

    const handleClick = (e: React.MouseEvent) => {
        const target = (e.target as Element).closest('[data-event-id]') as HTMLElement | null;
        if (!target) return;

        const id = target.dataset.eventId;
        const container = containerRef.current;
        const styleEl = styleRef.current;
        if (!id || !container || !styleEl) return;

        if (container.dataset.selected === id) {
            delete container.dataset.selected;
            styleEl.textContent = '';
        } else {
            container.dataset.selected = id;
            const safe = CSS.escape(id);
            styleEl.textContent =
                `.ra-timeline[data-selected="${safe}"] [data-events~="${safe}"],` +
                `.ra-timeline[data-selected="${safe}"] [data-event-id="${safe}"] {` +
                    `stroke-width: 3;` +
                    `filter: brightness(1.2);` +
                `}`;

            // SVG has no z-index — paint order is document order. Move every
            // highlighted leaf to the end of its parent, and move its lane
            // group to the end of the mask group, so highlights paint on top
            // of any non-highlighted siblings they cross.
            const selector = `[data-events~="${safe}"]`;
            container.querySelectorAll(selector).forEach(el => {
                const parent = el.parentNode as Element | null;
                if (!parent) return;
                parent.appendChild(el);
                const grandparent = parent.parentNode as Element | null;
                if (grandparent && grandparent.tagName.toLowerCase() === 'g') {
                    grandparent.appendChild(parent);
                }
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className={classNames(['ra-timeline', { expandable }])}
            onClick={handleClick}
        >
            <style ref={styleRef} />
            {processedEvents.map((event, index) => (
                <TimelineEvent
                    key={event.id}
                    event={event}
                    index={index}
                    getLaneClass={getLaneClass}
                    renderEvent={renderEvent}
                    expandable={expandable}
                />
            ))}
        </div>
    );
}

export default Timeline;
