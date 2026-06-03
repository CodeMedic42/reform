import React from 'react';
import { LANE_WIDTH, LANE_CENTER, LINE_STROKE } from './timeline-constants.js';

import type { TimelineEventNodeProps } from './timeline-event-node.js';

interface TimelineEventNodeExtensionProps extends Omit<TimelineEventNodeProps, 'index'> {}

function joinEvents(ids: string[] | undefined): string | undefined {
    return ids && ids.length > 0 ? ids.join(' ') : undefined;
}

function TimelineEventNodeExtension({ event, getLaneClass, svgWidth }: TimelineEventNodeExtensionProps) {
    const { lane, branches, incomingConnections, activeLanes,
        passThroughBranches, hasLineBelow, laneContinuationEvents } = event;

    const branchLanes = branches.map(b => b.lane);

    return (
        <svg
            viewBox={`0 0 ${svgWidth} 20`}
            preserveAspectRatio="none"
            style={{
                width: svgWidth,
            }}
        >
                {activeLanes.map((active, laneIndex) => {
                    if (!active) {
                        return null;
                    }
                    
                    if (branchLanes.includes(laneIndex) && !passThroughBranches.includes(laneIndex)) {
                        return null;
                    }

                    const isTerminating = incomingConnections.some(
                        c => c.lane === laneIndex && c.terminates
                    );

                    if (isTerminating) {
                        return null;
                    }
                    
                    if (laneIndex === lane && !hasLineBelow) {
                        return null;
                    }

                    const dataEvents = joinEvents(laneContinuationEvents[laneIndex]);

                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <g key={`var-${laneIndex}`} className={getLaneClass(laneIndex)}>
                            <line
                                x1={laneIndex * LANE_WIDTH + LANE_CENTER}
                                y1="0"
                                x2={laneIndex * LANE_WIDTH + LANE_CENTER}
                                y2="20"
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                                data-events={dataEvents}
                            />
                        </g>
                    );
                })}
        </svg>
    );
}

export default TimelineEventNodeExtension;
