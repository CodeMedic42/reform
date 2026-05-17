import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import TimelineEventNode from './timeline-event-node.js';
import TimelineEventNodeExtension from './timeline-event-node-extension.js';
import { LANE_WIDTH } from './timeline-constants.js';

import type { TimelineEventType, ProcessedEventType } from './timeline-types.js';

interface TimelineEventProps {
    event: ProcessedEventType;
    index: number;
    getLaneClass: (laneIndex: number) => string;
    renderEvent?: (event: TimelineEventType, index: number) => React.ReactNode;
    expandable?: boolean;
}

function computeSvgWidth(event: ProcessedEventType): number {
    const { lane, branches, mergesFromAbove, incomingConnections, activeLanes } = event;
    const branchLanes = branches.map(b => b.lane);
    const mergeLanes = mergesFromAbove.map(c => c.lane);
    const incomingLanes = incomingConnections.map(c => c.lane);
    const maxLane = Math.max(lane, ...branchLanes, ...mergeLanes, ...incomingLanes, activeLanes.length - 1);
    return (maxLane + 1) * LANE_WIDTH;
}

function TimelineEvent({ event, index, getLaneClass, renderEvent, expandable }: TimelineEventProps) {
    const [expanded, setExpanded] = useState(!expandable);
    const [isHovered, setIsHovered] = useState(false);
    const hasMountedRef = useRef(false);

    useEffect(() => {
        hasMountedRef.current = true;
    }, []);

    const svgWidth = computeSvgWidth(event);
    const hasContent = !!renderEvent;

    const handleToggle = (e: React.MouseEvent) => {
        if (!expandable) return;
        if ((e.target as Element).closest('[data-event-id]')) return;
        setExpanded(prev => !prev);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (expandable && e.key === 'Enter') {
            e.preventDefault();
            setExpanded(prev => !prev);
        }
    };

    return (
        <div className="ra-timeline-event">
            <div
                className="ra-timeline-event-header"
                onClick={expandable ? handleToggle : undefined}
                onMouseEnter={expandable ? () => setIsHovered(true) : undefined}
                onMouseLeave={expandable ? () => setIsHovered(false) : undefined}
                onKeyDown={expandable ? handleKeyDown : undefined}
                tabIndex={expandable ? 0 : undefined}
                role={expandable ? 'button' : undefined}
                aria-expanded={expandable ? expanded : undefined}
            >
                <TimelineEventNode event={event} index={index} getLaneClass={getLaneClass} svgWidth={svgWidth} />
                {event.title != null && (
                    <div className="ra-timeline-event-title">
                        {event.title}
                    </div>
                )}
            </div>

            {hasContent && (
                <div
                    className={classNames("ra-timeline-event-body", { expanded })}
                >
                    <div
                        className="ra-timeline-event-body-inner"
                    >
                        <TimelineEventNodeExtension event={event} getLaneClass={getLaneClass} svgWidth={svgWidth} />
                        <div className="ra-timeline-event-content">
                            {renderEvent(event, index)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimelineEvent;