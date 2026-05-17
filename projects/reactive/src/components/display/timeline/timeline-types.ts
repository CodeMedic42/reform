/**
 * Input data for a single event (node) in the timeline.
 * Events are ordered newest-first in the array.
 */
export interface TimelineEventType {
    /** Unique identifier for this event */
    id: string;
    /** Display title for this event, shown next to the node SVG */
    title?: string;
    /**
     * The primary parent of this event. Determines lane inheritance:
     * the primary parent is placed on the same lane as this event.
     * Only ONE child may claim a given event as its primary parent.
     */
    parent?: string | null;
    /**
     * Additional (non-primary) parent connections. Create visual merge/branch
     * curves but do NOT affect lane inheritance.
     */
    ancillaryParents?: string[];
}

/**
 * A connection from a event to an ancillary parent on a higher lane.
 * Rendered as a curve coming down from the parent's lane.
 */
export interface MergeConnectionType {
    parentId: string;
    lane: number;
}

/**
 * A connection arriving at a event's row from a routing lane or
 * extended child lane. Used for routed branches (two-part connections)
 * and relocated merges (curve at parent's row instead of child's).
 */
export interface IncomingConnectionType {
    /** The lane the vertical line arrives from */
    lane: number;
    /** true = line enters from above (y=0), false = from below (y=20) */
    fromAbove: boolean;
    /** true = the incoming lane ends here (no events on it below this row) */
    terminates: boolean;
}

/**
 * A fully processed event with all rendering data computed.
 */
export interface ProcessedEventType extends TimelineEventType {
    /** The horizontal lane (column) this event is rendered in. Lane 0 is leftmost. */
    lane: number;
    /**
     * Lane numbers of children that branch off from this event.
     * Rendered as curves going upward from this event's circle.
     */
    branches: number[];
    /**
     * Ancillary parent connections where the parent is on a higher lane number.
     * Rendered as curves on this event's row coming down from the parent's lane.
     */
    mergesFromAbove: MergeConnectionType[];
    /**
     * Connections arriving at this event's row from a routing lane or
     * extended child lane. Rendered as curves from the incoming lane
     * to this event's circle.
     */
    incomingConnections: IncomingConnectionType[];
    /** Snapshot of active lanes at this event's row. */
    activeLanes: boolean[];
    /**
     * Merge lanes that were already active before the merge — these need full
     * through-lines because they continue past this event in both directions.
     */
    passThroughMerges: number[];
    /**
     * Branch lanes that continue below this event — these need full
     * through-lines because the lane has events further down.
     */
    passThroughBranches: number[];
    /**
     * Incoming connection lanes that were already active — these need full
     * through-lines because they continue past this event in both directions.
     */
    passThroughIncoming: number[];
    /** Whether this event's lane was active in the row above. */
    hasLineAbove: boolean;
    /** Whether this event's lane is active in the row below. */
    hasLineBelow: boolean;
}

/**
 * Input data for a single event (node) in the timeline.
 * Events are ordered newest-first in the array.
 */
export interface TimelineEventType {
    /** Unique identifier for this event */
    id: string;
    /** Display title for this event, shown next to the node SVG */
    title?: string;
    /**
     * The primary parent of this event. Determines lane inheritance:
     * the primary parent is placed on the same lane as this event.
     * Only ONE child may claim a given event as its primary parent.
     */
    parent?: string | null;
    /**
     * Additional (non-primary) parent connections. Create visual merge/branch
     * curves but do NOT affect lane inheritance.
     */
    ancillaryParents?: string[];
}

/**
 * A connection from a event to an ancillary parent on a higher lane.
 * Rendered as a curve coming down from the parent's lane.
 */
export interface MergeConnectionType {
    parentId: string;
    lane: number;
}

/**
 * A connection arriving at a event's row from a routing lane or
 * extended child lane. Used for routed branches (two-part connections)
 * and relocated merges (curve at parent's row instead of child's).
 */
export interface IncomingConnectionType {
    /** The lane the vertical line arrives from */
    lane: number;
    /** true = line enters from above (y=0), false = from below (y=20) */
    fromAbove: boolean;
    /** true = the incoming lane ends here (no events on it below this row) */
    terminates: boolean;
}

/**
 * A fully processed event with all rendering data computed.
 */
export interface ProcessedEventType extends TimelineEventType {
    /** The horizontal lane (column) this event is rendered in. Lane 0 is leftmost. */
    lane: number;
    /**
     * Lane numbers of children that branch off from this event.
     * Rendered as curves going upward from this event's circle.
     */
    branches: number[];
    /**
     * Ancillary parent connections where the parent is on a higher lane number.
     * Rendered as curves on this event's row coming down from the parent's lane.
     */
    mergesFromAbove: MergeConnectionType[];
    /**
     * Connections arriving at this event's row from a routing lane or
     * extended child lane. Rendered as curves from the incoming lane
     * to this event's circle.
     */
    incomingConnections: IncomingConnectionType[];
    /** Snapshot of active lanes at this event's row. */
    activeLanes: boolean[];
    /**
     * Merge lanes that were already active before the merge — these need full
     * through-lines because they continue past this event in both directions.
     */
    passThroughMerges: number[];
    /**
     * Branch lanes that continue below this event — these need full
     * through-lines because the lane has events further down.
     */
    passThroughBranches: number[];
    /**
     * Incoming connection lanes that were already active — these need full
     * through-lines because they continue past this event in both directions.
     */
    passThroughIncoming: number[];
    /** Whether this event's lane was active in the row above. */
    hasLineAbove: boolean;
    /** Whether this event's lane is active in the row below. */
    hasLineBelow: boolean;
}
