import React from 'react';
import { LANE_WIDTH, LANE_CENTER, LINE_STROKE, CIRCLE_FILL } from './timeline-constants.js';

import type { ProcessedEventType } from './timeline-types.js';

export interface TimelineEventNodeProps {
    event: ProcessedEventType;
    index: number;
    getLaneClass: (laneIndex: number) => string;
    svgWidth: number;
}

/**
 * Creates an SVG mask that cuts out a circle around the event's dot,
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

function TimelineEventNode({ event, index, getLaneClass, svgWidth }: TimelineEventNodeProps) {
    const { lane, branches, mergesFromAbove, incomingConnections, activeLanes,
        passThroughMerges, passThroughBranches, passThroughIncoming,
        hasLineAbove, hasLineBelow } = event;

    const mergeLanes = mergesFromAbove.map(c => c.lane);
    const incomingLanes = incomingConnections.map(c => c.lane);
    const offset = lane * LANE_WIDTH;
    const maskId = `cutout-${index}`;
    const sortedBranches = [...branches].sort((a, b) => b - a);

    return (
        <svg
            className="ra-timeline-event-node"
            width={svgWidth}
            height="20"
            viewBox={`0 0 ${svgWidth} 20`}
        >
            <defs>
                {buildCutoutMask(maskId, offset, svgWidth)}
            </defs>

            <g mask={`url(#${maskId})`}>
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

                {incomingConnections.map((conn) => {
                    const incLane = conn.lane;
                    const incX = incLane * LANE_WIDTH + LANE_CENTER;
                    const startY = conn.fromAbove ? 0 : 20;
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

            <title>{event.id}</title>

            <g className={getLaneClass(lane)}>
                <circle cx={offset + LANE_CENTER} cy="10" r="4" fill={CIRCLE_FILL} />
            </g>
        </svg>
    );
}

export default TimelineEventNode;