# Timeline Component Requirements

## Purpose
The Timeline component renders a git commit graph-like interface showing events (nodes) connected by lanes (vertical lines) with branching and merging curves. It is generic and not tied to git — any data with parent-child relationships can be visualized.

## Data Model

### Events
- Each event has a unique `id`.
- Events are provided in an array ordered **newest-first** (the first element renders at the top).
- A event may have a **primary parent** (`parent`): the single older event it directly continues from. The primary parent determines lane inheritance.
- A event may have **ancillary parents** (`ancillaryParents`): additional older events it connects to. These create merge/branch curves but do not affect lane inheritance.
- A event may have no parent at all (root node).
- A event may carry an optional `title` shown next to the node SVG.
- A event may carry an optional `variant` selecting the node shape — `'circle'` (default), `'square'`, or `'triangle'`.

### Primary Parent Rules
- Only **one child** may claim a given event as its primary parent. If two children claim the same primary parent, the second is warned and its primary is demoted to ancillary.
- The primary parent inherits the child's lane (vertical continuation on the same column).
- There is no code that promotes an ancillary parent to primary if no primary is specified. A event with no primary parent but with ancillary parents is valid.

### Ancillary Parent Rules
- Ancillary parents get their own separate lanes.
- If an ancillary parent is later claimed as a primary parent by another event, the primary claim supersedes and the parent's lane is reassigned.

## Processing Pipeline

The `processEvents` function transforms raw events into fully rendered data through six stages:

### Pass 1: Lane Assignment
- Lanes are assigned in a **top-to-bottom** pass (newest to oldest).
- Each event either uses a pre-assigned lane (from a newer child's placeholder) or gets a new lane.
- A event's **primary parent** inherits the event's lane (same column, straight vertical line).
- **Ancillary parents** receive new lanes via allocation.
- If a parent was previously assigned a lane via an ancillary reference and is later claimed as a primary parent, the primary supersedes. The parent's lane is reassigned to match the primary child's lane and the old lane is freed for reuse.
- When a lane is freed (via reassignment), it goes into a pool and is reused before allocating new lane numbers.

### Lane Compaction
- After lane assignment, removes gaps in lane numbering caused by lanes that were freed during reassignment but never permanently occupied.
- Collects all used lane numbers, sorts them, and remaps to consecutive integers (0, 1, 2, ...).

### Lane Collapsing
- Merges non-overlapping lanes into the same column to minimize graph width (interval graph coloring).
- Computes the **active range** `[minIndex, maxIndex]` for each lane, including extensions for branch and merge connections.
- Uses greedy interval coloring: sorts lanes by start index, assigns each to the lowest column whose previous occupant's range ended before this lane's range starts.
- Builds **lane segments** — per-lane lists of active intervals. Collapsed lanes have multiple segments (one per original lane); non-collapsed lanes have one segment. Segments track discontinuous active ranges so through-lines don't falsely bridge independent sections sharing a column.

### Pass 1.5: Collision Detection & Resolution
- Detects connections whose visual lines would pass through intervening events on the connecting lane.
- Three resolution strategies, tried in order of preference:

  1. **Rerouted branch**: The child's lane has a collision but the parent's lane is clear between the two events. The connection uses the parent's lane instead, with an **incoming connection** curve at the child's row. No lane shift needed.

  2. **Relocated merge**: The parent's lane (merge lane) has a collision but the child's lane is clear. The merge curve moves from the child's row to the **parent's row**, with the child's lane extended downward via through-lines. An incoming connection curve is added at the parent's row.

  3. **Routing lane** (last resort): Both lanes are blocked. All lanes >= the child's lane shift right by 1 to insert an empty **routing lane**. The connection becomes two-part: a branch curve at the parent's row to the routing lane, through-lines on the routing lane, and an incoming connection curve at the child's row from the routing lane.

- After collision resolution, lane segments are extended for:
  - Routing lane endpoints (routing lane active from child to parent row)
  - Relocated merges (child's lane extended to parent's row)
  - Normal branches (child's lane extended to the furthest parent's row)

- Each `IncomingConnectionType` records the lane it arrives from, whether it enters from above or below, whether it terminates here, and the `otherEventId` at the far end of the edge — required for the highlight feature to know which event the connection belongs to.

### Pass 2: Build & Compute
- Creates `ProcessedEventType` entries with all rendering data.
- Classifies each ancillary/primary connection as a branch, merge, routed, rerouted, or relocated — and populates the corresponding arrays.
- Branches are recorded as `BranchType { lane, childId }` so the renderer can tag each branch curve with the (parent, child) endpoint IDs for highlighting.
- Tracks **active lanes** top-to-bottom:
  - Lanes activate when a event on that lane is processed, when a merge connection references the lane, or when an incoming connection references the lane.
  - Lanes deactivate at branch endpoints when the current lane segment ends at the current row.
  - Incoming connection lanes (fromAbove) deactivate when their segment ends.
- Detects **pass-throughs** (branch, merge, or incoming lanes that were already active and whose segment continues below).
- Computes `hasLineAbove` from the previous event's `activeLanes` snapshot, with a segment-gap override: if the previous row's segment for this lane doesn't reach the current row, `hasLineAbove` is forced to false (prevents false connections between collapsed lane sections).

### Pass 3: hasLineBelow
- Requires the next event's `activeLanes` snapshot (not available during Pass 2).
- `hasLineBelow` is true if this event's lane is active in the next event's snapshot.

### Pass 4: Edge Tracing (laneTopEvents / laneBottomEvents)
- Builds explicit `EdgeTrace` entries for every parent-child relationship in the graph.
- Each trace records the lane its through-line travels along, the row range `[lo, hi]` it spans, and two flags `skipLo` / `skipHi` that suppress endpoint attribution when the edge has a visible curve at that endpoint (the curve already represents the edge there).
- Per edge type:
  | Edge type           | Trace lane     | skipLo | skipHi |
  |---------------------|----------------|--------|--------|
  | Primary same-lane   | child's lane   | false  | false  |
  | Normal branch       | child's lane   | false  | **true** (branch curve at parent's row) |
  | Normal merge        | parent's lane  | **true** (merge curve at child's row) | false  |
  | Rerouted            | parent's lane  | **true** (incoming at child's row)    | false  |
  | Relocated           | child's lane   | false  | **true** (incoming at parent's row)   |
  | Routed              | routing lane   | **true** (incoming at child's row)    | **true** (branch curve at parent's row) |
- For each trace, the endpoint event IDs are pushed into the row's `laneTopEvents[lane]` / `laneBottomEvents[lane]` arrays:
  - At `lo` (not skipped) → `bottom`
  - At `hi` (not skipped) → `top`
  - At every mid row `lo < r < hi` → both `top` and `bottom`
- Multiple edges sharing a row × lane × half union their endpoint IDs — so a through-line carrying both the I→CC and K→CC edges shows up with `data-events="I CC K"`.
- These arrays drive the `data-events` attributes on rendered through-lines (see Click-to-Highlight below).

## Visual Rendering

### Layout
- Each event occupies a horizontal row containing a clickable **header** (node SVG + optional title) and, when `renderEvent` is provided, an expandable **body**.
- The header uses `display: flex` with `align-items: center`.
- The body sits below the header and uses a CSS-grid `grid-template-rows: 0fr → 1fr` transition for smooth expand/collapse when `expandable` is set.

### Two-SVG Architecture
Each event's node column contains two SVGs stacked vertically:

1. **Static SVG** (fixed 20px height, `flex-shrink: 0`):
   - Contains all complex graphics: through-lines, branch curves, merge curves, incoming connection curves, cutout mask, and the shape (`<circle>`, `<rect>`, or `<polygon>` per variant).
   - All coordinates are in a fixed `viewBox="0 0 W 20"` — no stretching.
   - Curves and lines share the same coordinate space, so they align perfectly.

2. **Variable SVG** (fills remaining height of the body via `flex: 1`):
   - Rendered only when the body is present (i.e., when `renderEvent` is provided).
   - Contains only straight vertical through-lines for lanes that continue below the row.
   - Uses `preserveAspectRatio="none"` so lines stretch to fill available space.
   - When content is exactly 20px, this SVG has 0 height and renders nothing.

### Through-Lines
- Vertical lines representing lanes that pass through a event's row.
- Drawn for all **active lanes** except:
  - Branch lanes (non-pass-through): the branch curve handles the visual connection.
  - Merge lanes (non-pass-through): the merge curve handles the visual connection.
  - Incoming connection lanes (non-pass-through): the incoming curve handles the visual connection.
  - Terminating incoming lanes: the lane ends here; the curve handles the visual and no through-line is needed even if pass-through.
  - The event's own lane if it has nothing above AND below (isolated event).
- **Half-lines** for lane endpoints on the event's own lane:
  - `hasLineAbove = false`: line starts at y=10 (shape center) instead of y=0.
  - `hasLineBelow = false`: line ends at y=10 instead of y=20.
- **Split rendering**: each through-line is conceptually split at y=10 into a TOP half and a BOTTOM half so each half can carry its own `data-events` attribution from Pass 4.
  - If the top and bottom halves resolve to the same `data-events` string, a single `<line>` from y=0 to y=20 is rendered.
  - If they differ, two `<line>` elements are rendered (y=0..10 and y=10..20) with distinct `data-events`.
- In the **variable SVG**, through-lines are skipped for:
  - Branch lanes that are not pass-through (they end at this event).
  - Terminating incoming lanes (the lane ends here, no through-line below).
  - The event's own lane if `hasLineBelow` is false.
- Variable-SVG through-lines tag their `data-events` from the event's `laneBottomEvents[lane]` (the bottom-half attribution of the row above carries through the continuation).

### Branch Curves
- Drawn on the **parent** event's row.
- A branch means a child is on a different lane from the parent.
- The curve goes from the parent's shape area (y=10) **upward** to the child's lane (y=0).
- Uses a quadratic bezier that starts horizontal and turns vertical.
- For branches more than 1 lane away, a horizontal line bridges from the shape to the curve start.
- Rendered highest-lane-first so lower lanes draw on top.
- Branch lanes are created in two cases:
  1. A child's primary parent is on a different lane.
  2. A child lists a event as an ancillary parent and that event is on a **lower** lane.
- Both the bridging line and the curve carry `data-events="{parentId} {childId}"`.

### Merge Curves (From Above)
- Drawn on the **child** event's row.
- A merge means an ancillary parent is on a **higher** lane than the child.
- The curve comes **down** from the parent's lane (y=20) and turns left toward the child's shape.
- Uses a quadratic bezier that starts vertical and turns horizontal.
- For merges more than 1 lane away, a horizontal line bridges from the curve end to the shape.
- Both elements carry `data-events="{childId} {parentId}"`.

### Incoming Connection Curves
- Drawn at the target event's row for rerouted branches, relocated merges, and routing lane connections.
- A vertical line on the incoming lane enters the row and curves toward the event's shape.
- Two entry directions:
  - **fromAbove** (`y=0`): the vertical line enters from above (used for relocated merges where the child is above the parent).
  - **fromBelow** (`y=20`): the vertical line enters from below (used for rerouted branches and routing lane connections where the parent is below the child).
- Uses a quadratic bezier: `M incX,startY Q incX,10 adjacentX,10`.
- For connections more than 1 lane away, a horizontal bridge extends from the curve end to the event's shape.
- Color uses the incoming lane's palette color.
- The `terminates` flag indicates whether the incoming lane ends at this row (no events or connections on it below). Terminating incoming lanes skip through-lines in both the static and variable SVGs.
- Both elements carry `data-events="{eventId} {otherEventId}"`.

### Node Shapes & Cutout Masks
- The visible node shape is determined by the `variant` field on the event (`'circle'` default, `'square'`, `'triangle'`).
- All shapes share an **8×8 px bounding box** centered at `(centerX, 10)`:
  - **circle**: `<circle cx=centerX cy=10 r=4>`
  - **square**: `<rect x=centerX-4 y=6 width=8 height=8>`
  - **triangle**: equilateral, pointing up, `<polygon points="centerX,6 centerX-4,14 centerX+4,14">`
- The shape is rendered **outside** the mask group so it draws on top of everything.
- The shape carries `data-event-id={event.id}` for click-to-highlight targeting.
- Color: shade 600 (`--clr-plt-600`) for fill via `CIRCLE_FILL`.
- Each event has an SVG mask that cuts the shape out of through-lines and curves, preventing them from drawing over the node. Cutout shape matches the visible variant:
  - **circle**: `<circle r=6>` (2px perpendicular padding)
  - **square**: `<rect x=centerX-6 y=4 width=12 height=12>` (2px padding all around)
  - **triangle**: `<polygon points="centerX,2 centerX-7,16 centerX+7,16">` — slanted sides parallel to the triangle's edges with ~1.79px perpendicular clearance, while the bottom keeps the 2px gap.
- Mask IDs are unique per event (using the array index) to avoid cross-SVG ID collisions.
- Must use `maskUnits="userSpaceOnUse"` with explicit pixel dimensions for cross-browser compatibility.
- Each event SVG also contains a `<title>{event.id}</title>` element for native browser tooltips.

### Colors
- Colors are provided as an array of palette color names (e.g., `['blue', 'purple', 'green']`).
- Each lane gets a color via `colors[laneIndex % colors.length]` (wraps around).
- Colors are applied as CSS classes (`ra-clr-plt-{name}`) on `<g>` elements wrapping SVG shapes.
- These classes set CSS custom properties `--clr-plt-100` through `--clr-plt-900`.
- Lines use shade 400 (`--clr-plt-400`), shapes use shade 600 (`--clr-plt-600`).

### Active Lanes & Lane Segments
- A lane is **active** at a event's row if it has been encountered and not yet deactivated.
- Lanes activate when a event on that lane is processed, when a merge connection references that lane, or when an incoming connection references that lane.
- Lanes deactivate when the current lane segment ends:
  - At branch endpoints, if the branch lane's segment ends at or before this row.
  - At incoming connection endpoints (fromAbove), if the lane's segment ends at or before this row.
- **Lane segments** track discontinuous active ranges for collapsed lanes. A collapsed lane may have multiple segments (e.g., `[3,4]` and `[5,13]`). The `getSegmentEnd(lane, index)` function returns the end of the segment containing a given index, enabling segment-aware deactivation and pass-through detection.
- **Pass-through branches**: when a branch lane's current segment continues below this row, the through-line is drawn instead of being skipped.
- **Pass-through merges**: when a merge lane was already active before the merge activated it, the lane continues in both directions.
- **Pass-through incoming**: when an incoming connection lane was already active, the lane continues.

### hasLineAbove / hasLineBelow
- `hasLineAbove`: true if this event's lane was active in the previous event's `activeLanes` snapshot AND the previous row's lane segment reaches this row. The segment check prevents false connections between independent sections sharing a collapsed lane column.
- `hasLineBelow`: true if this event's lane is active in the next event's `activeLanes` snapshot. Controls whether the own-lane through-line ends at y=20 (full) or y=10 (half), and whether the variable SVG draws the own lane.

## Expandable Behavior

When the `expandable` prop is `true`:
- Each event's body content (from `renderEvent`) is collapsed by default.
- The header is `cursor: pointer`, `role="button"`, `tabIndex={0}`, with `aria-expanded` reflecting state.
- Clicking the header toggles its `expanded` state — except when the click originated on the node shape (`[data-event-id]`), which is reserved for the highlight feature. The toggle is suppressed in that case so a node click highlights without expanding.
- Pressing `Enter` on a focused header toggles state.
- A hover background (`#f0f0f0`) is applied to the header.
- Expand/collapse animates via CSS grid `grid-template-rows` transition (0fr → 1fr over 300ms ease).

When `expandable` is `false` (default), the body is always expanded and the header is not clickable for toggling (clicks may still trigger highlight selection).

## Click-to-Highlight

Clicking a node shape highlights it and every line directly connecting it to its immediate parents and children (one-hop edges, full multi-row paths). Clicking the same shape again deselects.

### State model
- Selection is **internal** to the Timeline component, tracked via a `data-selected="{id}"` attribute on the root `.ra-timeline` element.
- Click handling is direct DOM mutation in the click handler — **no React re-renders** occur during selection changes. React renders the timeline markup (with all the tagging) once per data change.

### Tagging
- The shape (`<circle>` / `<rect>` / `<polygon>`) carries `data-event-id={event.id}`.
- Every through-line `<line>` and every curve / horizontal-bridge `<line>` / `<path>` carries `data-events="{id1} {id2} ..."` — a space-separated list of event IDs whose edges visually traverse this element. These come from:
  - For through-line halves: `laneTopEvents[lane]` or `laneBottomEvents[lane]` (Pass 4).
  - For branch curves: `"{event.id} {branch.childId}"`.
  - For merge curves: `"{event.id} {merge.parentId}"`.
  - For incoming curves: `"{event.id} {incoming.otherEventId}"`.

### Click handler
- A single click listener at the `.ra-timeline` root uses event delegation. It looks up `(e.target as Element).closest('[data-event-id]')` to find the clicked shape (if any) and reads the ID from its dataset.
- If the clicked ID matches `data-selected`, the handler clears `data-selected` and empties the injected `<style>` block (deselect).
- Otherwise, the handler:
  1. Sets `data-selected={id}` on the root.
  2. Writes a single CSS rule into a sibling `<style>` element:
     ```css
     .ra-timeline[data-selected="{safe}"] [data-events~="{safe}"],
     .ra-timeline[data-selected="{safe}"] [data-event-id="{safe}"] {
         stroke-width: 3;
         filter: brightness(1.2);
     }
     ```
     where `{safe}` is `CSS.escape(id)` to prevent injection / malformed selectors when event IDs contain `:`, `.`, etc.
  3. Reorders the DOM so highlighted elements paint on top (see Paint Order below).
- The `~=` CSS attribute selector matches whole words in the space-separated `data-events` list, so IDs sharing substrings (`node1` vs `node11`) don't collide.

### Edge attribution rules
- The `data-events` attribute on each element lists every event whose edge visually passes through it. A single through-line can therefore carry multiple IDs (e.g., two children both routing through a shared parent lane).
- Through-line halves at endpoint rows (lo or hi of an edge) are suppressed for that edge when the edge has a visible curve at that endpoint — the curve already represents the edge there, and the through-line at that row belongs to other traffic on the lane. See the skipLo/skipHi table in Pass 4.
- This produces clean per-edge highlighting: clicking a node lights up the curves that represent its edges plus the continuation through-lines, without falsely lighting up unrelated traffic at the endpoints.

### Paint order
- SVG has no `z-index` — paint order equals document order. After applying the highlight style, the click handler walks every `[data-events~="{id}"]` element, moves it to the end of its parent (so it paints after its siblings), and moves its parent lane `<g>` to the end of the mask group (so the lane group paints after sibling lane groups). This ensures highlighted strokes are not visually nicked by non-highlighted lines that happen to cross them in unrelated lanes.
- DOM order is not restored on deselect; non-highlighted elements all render with the same stroke, so order has no visual effect when nothing is selected.

## Component API

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `TimelineEventType[]` | `[]` | Array of events ordered newest-first |
| `renderEvent` | `(event, index) => ReactNode` | `undefined` | Optional render prop for event body content. When omitted, no body is rendered. |
| `expandable` | `boolean` | `false` | When true, body content is initially hidden and toggled by clicking/Enter on the header. |
| `colors` | `string[]` | `[]` (required prop) | Palette color names for lane coloring. Lanes cycle through this list. |

### TimelineEventType Interface
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` (optional) | Display title shown next to the node SVG |
| `parent` | `string \| null \| undefined` | Primary parent event ID |
| `ancillaryParents` | `string[]` (optional) | Additional parent event IDs |
| `variant` | `'circle' \| 'square' \| 'triangle'` (optional) | Node shape. Defaults to `'circle'`. |

### Derived Types (used internally)
- `BranchType { lane: number; childId: string }` — a branch curve on a parent event, with the child it leads to.
- `MergeConnectionType { parentId: string; lane: number }` — a merge curve on a child event, with the ancillary parent it connects to.
- `IncomingConnectionType { lane: number; fromAbove: boolean; terminates: boolean; otherEventId: string }` — a curve arriving at the event's row from a routing / extended lane, with the event at the far end of the edge.
- `ProcessedEventType extends TimelineEventType` adds `lane`, `branches`, `mergesFromAbove`, `incomingConnections`, `activeLanes`, `passThroughMerges`, `passThroughBranches`, `passThroughIncoming`, `hasLineAbove`, `hasLineBelow`, `laneTopEvents`, `laneBottomEvents`.

## Known Limitations / Future Work
- Lane width (`LANE_WIDTH = 12`) and SVG height (20px) are hardcoded constants, not configurable via props.
- The greedy interval coloring for lane collapsing may not always produce the optimal (minimum-width) result for all graph topologies.
- When both lanes of a connection are blocked by intervening events, the routing lane shift increases graph width globally. A more targeted shift (only shifting affected rows) would be more compact but significantly more complex.
- Highlight selection is uncontrolled (no `onSelect` callback / controlled `selectedId` prop) — a parent component cannot coordinate selection with external UI like a detail panel.
- Highlight selection is not restored to DOM order on deselect; if the timeline is interacted with heavily before a data update, the SVG element order may drift from the initial render order until React re-renders.
