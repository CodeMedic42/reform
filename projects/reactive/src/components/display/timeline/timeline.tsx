import React, { useMemo } from 'react';
import classnames from 'classnames';
import { map } from 'lodash-es';

interface Moment {
    id: string;
    parent: string | null;
    mergeParents?: string[];
}

interface MergeConnection {
    parentId: string;
    lane: number;
}

interface ProcessedMoment extends Moment {
    lane: number;
    branches: number[];
    mergesFromAbove: MergeConnection[];
    mergesFromBelow: MergeConnection[];
    activeLanes: boolean[];
    passThroughMerges: number[];
    hasLineAbove: boolean;
    hasLineBelow: boolean;
}

interface WorkflowProps {
    moments?: Moment[];
    children: (moment: Moment, index: number) => React.ReactNode;
    colors: string[];
}

const LANE_WIDTH = 12;
const LANE_CENTER = LANE_WIDTH / 2;
const LINE_STROKE = 'var(--clr-plt-400)';
const CIRCLE_FILL = 'var(--clr-plt-600)';

function buildCutoutMask(id: string, offset: number = 0, width: number = LANE_WIDTH) {
    return (
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height="20">
            <rect x="0" y="0" width={width} height="20" fill="white" />
            <circle cx={offset + LANE_CENTER} cy="10" r="6" fill="black" />
        </mask>
    );
}

function Timeline(props: WorkflowProps) {
    const {
        moments = [],
        children,
        colors = [],
        // colors = ['blue', 'purple', 'green', 'orange', 'red'],
    } = props;

    const processedMoments = useMemo(() => {
        const lookup: Record<string, ProcessedMoment> = {};
        const claimed: Record<string, boolean> = {};
        let nextLane = 0;

        // FIRST PASS: bottom-to-top (oldest to newest)
        for (let i = moments.length - 1; i >= 0; i--) {
            const moment = moments[i];
            let primaryParent = moment.parent;
            const momentMergeParents = [...(moment.mergeParents || [])];

            if (!primaryParent && momentMergeParents.length > 0) {
                primaryParent = momentMergeParents.shift()!;
            }

            let lane: number;

            if (!primaryParent || lookup[primaryParent] === undefined) {
                lane = nextLane++;
            } else if (!claimed[primaryParent]) {
                lane = lookup[primaryParent].lane;
                claimed[primaryParent] = true;
            } else {
                lane = nextLane++;
            }

            const mergesFromAbove: MergeConnection[] = [];
            const mergesFromBelow: MergeConnection[] = [];
            for (const mergeParentId of momentMergeParents) {
                const mergeParent = lookup[mergeParentId];
                if (mergeParent && mergeParent.lane !== lane) {
                    const conn = { parentId: mergeParentId, lane: mergeParent.lane };
                    if (mergeParent.lane > lane) {
                        mergesFromAbove.push(conn);
                    } else {
                        mergesFromBelow.push(conn);
                    }
                }
            }

            lookup[moment.id] = {
                ...moment,
                lane,
                branches: [],
                mergesFromAbove,
                mergesFromBelow,
                activeLanes: [],
                passThroughMerges: [],
                hasLineAbove: false,
                hasLineBelow: false,
            };

            if (primaryParent) {
                const parent = lookup[primaryParent];
                if (parent && lane !== parent.lane) {
                    parent.branches.push(lane);
                }
            }
        }

        // COLLISION RESOLUTION PASS
        const posIndex: Record<string, number> = {};
        for (let i = 0; i < moments.length; i++) {
            posIndex[moments[i].id] = i;
        }

        function shiftLanes(insertAt: number) {
            for (const id in lookup) {
                const m = lookup[id];
                if (m.lane >= insertAt) m.lane++;
                m.branches = m.branches.map(l => l >= insertAt ? l + 1 : l);
                m.mergesFromAbove.forEach(c => { if (c.lane >= insertAt) c.lane++; });
                m.mergesFromBelow.forEach(c => { if (c.lane >= insertAt) c.lane++; });
                m.passThroughMerges = m.passThroughMerges.map(l => l >= insertAt ? l + 1 : l);
            }
            for (const parentId in routingByParent) {
                const entry = routingByParent[parentId];
                if (entry.lane >= insertAt) {
                    entry.lane++;
                    entry.routingEntry.lane++;
                }
            }
        }

        function hasCollision(fromIdx: number, toIdx: number, targetLane: number): boolean {
            const minIdx = Math.min(fromIdx, toIdx) + 1;
            const maxIdx = Math.max(fromIdx, toIdx);
            for (let i = minIdx; i < maxIdx; i++) {
                if (lookup[moments[i].id].lane === targetLane) return true;
            }
            return false;
        }

        const routingLanes: { lane: number; fromIdx: number; toIdx: number }[] = [];
        const routingByParent: Record<string, { lane: number; routingEntry: typeof routingLanes[0] }> = {};

        for (let i = 0; i < moments.length; i++) {
            const processed = lookup[moments[i].id];
            const allMergeConns = [...processed.mergesFromAbove, ...processed.mergesFromBelow];

            for (const conn of allMergeConns) {
                const parentIdx = posIndex[conn.parentId];
                const parentLane = lookup[conn.parentId].lane;

                if (hasCollision(i, parentIdx, parentLane)) {
                    const existing = routingByParent[conn.parentId];
                    if (existing) {
                        conn.lane = existing.lane;
                        const minIdx = Math.min(i, existing.routingEntry.fromIdx);
                        const maxIdx = Math.max(parentIdx, existing.routingEntry.toIdx);
                        existing.routingEntry.fromIdx = minIdx;
                        existing.routingEntry.toIdx = maxIdx;
                        continue;
                    }

                    const routingLaneNum = parentLane + 1;
                    shiftLanes(routingLaneNum);

                    conn.lane = routingLaneNum;
                    lookup[conn.parentId].branches.push(routingLaneNum);
                    const minIdx = Math.min(i, parentIdx);
                    const maxIdx = Math.max(i, parentIdx);

                    const routingEntry = {
                        lane: routingLaneNum,
                        fromIdx: minIdx,
                        toIdx: maxIdx,
                    };
                    routingLanes.push(routingEntry);
                    routingByParent[conn.parentId] = { lane: routingLaneNum, routingEntry };
                }
            }
        }

        // SECOND PASS: top-to-bottom (activeLanes)
        const activeLanes: boolean[] = [];

        for (let i = 0; i < moments.length; i++) {
            const processed = lookup[moments[i].id];
            activeLanes[processed.lane] = true;

            const allMergeConns = [...processed.mergesFromAbove, ...processed.mergesFromBelow];
            for (const conn of allMergeConns) {
                if (activeLanes[conn.lane]) {
                    processed.passThroughMerges.push(conn.lane);
                }
                activeLanes[conn.lane] = true;
            }

            for (const rl of routingLanes) {
                if (i >= rl.fromIdx && i <= rl.toIdx) {
                    activeLanes[rl.lane] = true;
                }
            }

            processed.activeLanes = [...activeLanes];

            for (const branchLane of processed.branches) {
                activeLanes[branchLane] = false;
            }
        }

        // Third pass: hasLineAbove/hasLineBelow
        for (let i = 0; i < moments.length; i++) {
            const processed = lookup[moments[i].id];
            const prevActiveLanes = i > 0 ? lookup[moments[i - 1].id].activeLanes : [];
            const nextActiveLanes = i < moments.length - 1 ? lookup[moments[i + 1].id].activeLanes : [];
            processed.hasLineAbove = !!prevActiveLanes[processed.lane];
            processed.hasLineBelow = !!nextActiveLanes[processed.lane];
        }

        return moments.map(m => lookup[m.id]);
    }, [moments]);

    function getLaneClass(laneIndex: number) {
        return `ra-clr-plt-${colors[laneIndex % colors.length]}`;
    }

    function buildMomentNode(moment: ProcessedMoment, index: number) {
      const { lane, branches, mergesFromAbove, mergesFromBelow, activeLanes, passThroughMerges, hasLineAbove, hasLineBelow } = moment;
      const allMergeLanes = [...mergesFromAbove, ...mergesFromBelow].map(c => c.lane);
      const offset = lane * LANE_WIDTH;
      const maxLane = Math.max(lane, ...branches, ...allMergeLanes, activeLanes.length - 1);
      const svgWidth = (maxLane + 1) * LANE_WIDTH;
      const maskId = `cutout-${index}`;
      const sortedBranches = [...branches].sort((a, b) => b - a);

      return (
          <svg
            className="ra-timeline-moment-node"
            width={svgWidth}
            height="20"
            viewBox={`0 0 ${svgWidth} 20`}
            style={{ display: 'block' }}
        >
            <defs>
              {buildCutoutMask(maskId, offset, svgWidth)}
            </defs>
            <g mask={`url(#${maskId})`}>
                {/* === THROUGH-LINES === */}
                {activeLanes.map((active, laneIndex) => {
                    if (!active) return null;
                    if (branches.includes(laneIndex)) return null;
                    if (allMergeLanes.includes(laneIndex) && !passThroughMerges.includes(laneIndex)) return null;
                    const isOwnLane = laneIndex === lane;
                    const y1 = (isOwnLane && !hasLineAbove) ? "10" : "0";
                    const y2 = (isOwnLane && !hasLineBelow) ? "10" : "20";
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

                {/* === BRANCH CURVES === */}
                {sortedBranches.map((branchLane) => {
                    const branchOffset = branchLane * LANE_WIDTH;
                    const curveStartX = (branchLane - 1) * LANE_WIDTH + LANE_CENTER;
                    const curveEndX = branchOffset + LANE_CENTER;

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

                {/* === MERGES FROM ABOVE === */}
                {[...mergesFromAbove].sort((a, b) => b.lane - a.lane).map((conn) => {
                    const mergeLane = conn.lane;
                    const mergeOffset = mergeLane * LANE_WIDTH;
                    const curveStartX = mergeOffset + LANE_CENTER;
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

                {/* === MERGES FROM BELOW === */}
                {[...mergesFromBelow].sort((a, b) => a.lane - b.lane).map((conn) => {
                    const mergeLane = conn.lane;
                    const mergeOffset = mergeLane * LANE_WIDTH;
                    const curveStartX = (mergeLane + 1) * LANE_WIDTH + LANE_CENTER;
                    const curveOriginX = mergeOffset + LANE_CENTER;

                    return (
                        <g key={`merge-below-${mergeLane}`} className={getLaneClass(mergeLane)}>
                            <path
                                d={`M ${curveOriginX},20 Q ${curveOriginX},10 ${curveStartX},10`}
                                stroke={LINE_STROKE}
                                strokeWidth="2"
                                fill="none"
                            />
                            {lane - mergeLane > 1 && (
                                <line
                                    x1={curveStartX}
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
            <g className={getLaneClass(lane)}>
                <circle cx={offset + LANE_CENTER} cy="10" r="4" fill={CIRCLE_FILL} />
            </g>
          </svg>
      );
  }

    return (
        <div
            className="ra-timeline"
        >
            {map(processedMoments, (moment, index) => {
               return (
                <div
                    key={moment.id}
                    className={classnames(
                        'ra-timeline-step',
                    )}
                    style={{ display: 'flex', flexDirection: 'row' }}
                >
                    <div
                        className="ra-timeline-moment-node"
                    >
                        {buildMomentNode(moment, index)}
                    </div>
                </div>
               );
            })}
        </div>
    );
}

export default Timeline;
