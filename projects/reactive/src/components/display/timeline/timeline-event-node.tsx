import React from 'react';
import { LANE_WIDTH, LANE_CENTER, LINE_STROKE, CIRCLE_FILL } from './timeline-constants.js';

import type { ProcessedEventType, TimelineEventType } from './timeline-types.js';

type Variant = NonNullable<TimelineEventType['variant']>;

export interface TimelineEventNodeProps {
    event: ProcessedEventType;
    index: number;
    getLaneClass: (laneIndex: number) => string;
    svgWidth: number;
}

/**
 * Renders the visible node shape. All variants share an 8×8 bounding box
 * centered at (cx, 10).
 */
function renderShape(variant: Variant, cx: number, eventId: string) {
    switch (variant) {
        case 'square':
            return <rect x={cx - 4} y={6} width={8} height={8} fill={CIRCLE_FILL} data-event-id={eventId} />;
        case 'triangle':
            return <polygon points={`${cx},6 ${cx - 4},14 ${cx + 4},14`} fill={CIRCLE_FILL} data-event-id={eventId} />;
        case 'circle':
        default:
            return <circle cx={cx} cy={10} r={4} fill={CIRCLE_FILL} data-event-id={eventId} />;
    }
}

/**
 * Renders the black cutout shape used inside the mask. 2px larger than the
 * visible shape on every side so lines visually clear the node.
 */
function renderCutout(variant: Variant, cx: number) {
    switch (variant) {
        case 'square':
            return <rect x={cx - 6} y={4} width={12} height={12} fill="black" />;
        case 'triangle':
            // Apex (cx, 2) and base (cx ± 7, 16) — slanted sides parallel to
            // the triangle's edges with ~1.79px perpendicular clearance,
            // while the bottom keeps the 2px gap.
            return <polygon points={`${cx},2 ${cx - 7},16 ${cx + 7},16`} fill="black" />;
        case 'circle':
        default:
            return <circle cx={cx} cy={10} r={6} fill="black" />;
    }
}

function tagEvents(...ids: Array<string | null | undefined>): string | undefined {
    const filtered = ids.filter((x): x is string => !!x);
    return filtered.length > 0 ? filtered.join(' ') : undefined;
}

function joinEvents(ids: string[] | undefined): string | undefined {
    return ids && ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * Creates an SVG mask that cuts the event's shape out of through-lines and
 * curves so they don't draw over the node. Cutout shape matches the visible
 * variant. Must use maskUnits="userSpaceOnUse" with explicit dimensions for
 * cross-browser compatibility.
 */
function buildCutoutMask(id: string, variant: Variant, cx: number, width: number) {
    return (
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height="20">
            <rect x="0" y="0" width={width} height="20" fill="white" />
            {renderCutout(variant, cx)}
        </mask>
    );
}

function TimelineEventNode({ event, index, getLaneClass, svgWidth }: TimelineEventNodeProps) {
    const { lane, branches, mergesFromAbove, incomingConnections, activeLanes,
        passThroughMerges, passThroughBranches, passThroughIncoming,
        hasLineAbove, hasLineBelow, laneTopEvents, laneBottomEvents } = event;

    const branchLanes = branches.map(b => b.lane);
    const mergeLanes = mergesFromAbove.map(c => c.lane);
    const incomingLanes = incomingConnections.map(c => c.lane);
    const offset = lane * LANE_WIDTH;
    const centerX = offset + LANE_CENTER;
    const variant: Variant = event.variant ?? 'circle';
    const maskId = `cutout-${index}`;
    const sortedBranches = [...branches].sort((a, b) => b.lane - a.lane);

    return (
        <svg
            className="ra-timeline-event-node"
            width={svgWidth}
            height="20"
            viewBox={`0 0 ${svgWidth} 20`}
        >
            <defs>
                {buildCutoutMask(maskId, variant, centerX, svgWidth)}
            </defs>

            <g mask={`url(#${maskId})`}>
                {activeLanes.map((active, laneIndex) => {
                    if (!active) return null;
                    const isOwnLane = laneIndex === lane;
                    const isBranch = branchLanes.includes(laneIndex);
                    const isMerge = mergeLanes.includes(laneIndex);
                    const isIncoming = incomingLanes.includes(laneIndex);
                    const isPassThrough = passThroughMerges.includes(laneIndex)
                        || passThroughBranches.includes(laneIndex)
                        || passThroughIncoming.includes(laneIndex);

                    if (isOwnLane && !hasLineAbove && !hasLineBelow) return null;
                    if ((isBranch || isMerge || isIncoming) && !isPassThrough) return null;
                    if (isIncoming && incomingConnections.some(
                        c => c.lane === laneIndex && c.terminates
                    )) return null;

                    const renderTop = !isOwnLane || hasLineAbove;
                    const renderBottom = !isOwnLane || hasLineBelow;
                    if (!renderTop && !renderBottom) return null;

                    const x = laneIndex * LANE_WIDTH + LANE_CENTER;
                    const topData = joinEvents(laneTopEvents[laneIndex]);
                    const bottomData = joinEvents(laneBottomEvents[laneIndex]);

                    // Combine into one line when both halves render with the
                    // same attribution — avoids redundant DOM nodes.
                    if (renderTop && renderBottom && topData === bottomData) {
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <g key={`through-${laneIndex}`} className={getLaneClass(laneIndex)}>
                                <line
                                    x1={x}
                                    y1="0"
                                    x2={x}
                                    y2="20"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={topData}
                                />
                            </g>
                        );
                    }

                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <g key={`through-${laneIndex}`} className={getLaneClass(laneIndex)}>
                            {renderTop && (
                                <line
                                    x1={x}
                                    y1="0"
                                    x2={x}
                                    y2="10"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={topData}
                                />
                            )}
                            {renderBottom && (
                                <line
                                    x1={x}
                                    y1="10"
                                    x2={x}
                                    y2="20"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={bottomData}
                                />
                            )}
                        </g>
                    );
                })}

                {sortedBranches.map((branch) => {
                    const branchLane = branch.lane;
                    const curveStartX = (branchLane - 1) * LANE_WIDTH + LANE_CENTER;
                    const curveEndX = branchLane * LANE_WIDTH + LANE_CENTER;
                    const dataEvents = tagEvents(event.id, branch.childId);

                    return (
                        <g key={`branch-${branchLane}-${branch.childId}`} className={getLaneClass(branchLane)}>
                            {branchLane - lane > 1 && (
                                <line
                                    x1={offset + LANE_CENTER}
                                    y1="10"
                                    x2={curveStartX}
                                    y2="10"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={dataEvents}
                                />
                            )}
                            <path
                                d={`M ${curveStartX},10 Q ${curveEndX},10 ${curveEndX},0`}
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                                fill="none"
                                data-events={dataEvents}
                            />
                        </g>
                    );
                })}

                {[...mergesFromAbove].sort((a, b) => b.lane - a.lane).map((conn) => {
                    const mergeLane = conn.lane;
                    const curveStartX = mergeLane * LANE_WIDTH + LANE_CENTER;
                    const curveEndX = (mergeLane - 1) * LANE_WIDTH + LANE_CENTER;
                    const dataEvents = tagEvents(event.id, conn.parentId);

                    return (
                        <g key={`merge-above-${mergeLane}`} className={getLaneClass(mergeLane)}>
                            <path
                                d={`M ${curveStartX},20 Q ${curveStartX},10 ${curveEndX},10`}
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                                fill="none"
                                data-events={dataEvents}
                            />
                            {mergeLane - lane > 1 && (
                                <line
                                    x1={curveEndX}
                                    y1="10"
                                    x2={offset + LANE_CENTER}
                                    y2="10"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={dataEvents}
                                />
                            )}
                        </g>
                    );
                })}

                {incomingConnections.map((conn) => {
                    const incLane = conn.lane;
                    const incX = incLane * LANE_WIDTH + LANE_CENTER;
                    const startY = conn.fromAbove ? 0 : 20;
                    const adjacentLane = incLane < lane ? incLane + 1 : incLane - 1;
                    const adjacentX = adjacentLane * LANE_WIDTH + LANE_CENTER;
                    const dataEvents = tagEvents(event.id, conn.otherEventId);

                    return (
                        <g key={`incoming-${incLane}`} className={getLaneClass(incLane)}>
                            <path
                                d={`M ${incX},${startY} Q ${incX},10 ${adjacentX},10`}
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                                fill="none"
                                data-events={dataEvents}
                            />
                            {Math.abs(incLane - lane) > 1 && (
                                <line
                                    x1={adjacentX}
                                    y1="10"
                                    x2={offset + LANE_CENTER}
                                    y2="10"
                                    stroke={LINE_STROKE}
                                    strokeWidth="2"
                                    data-events={dataEvents}
                                />
                            )}
                        </g>
                    );
                })}
            </g>

            <title>{event.id}</title>

            <g className={getLaneClass(lane)}>
                {renderShape(variant, centerX, event.id)}
            </g>
        </svg>
    );
}

export default TimelineEventNode;
