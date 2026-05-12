# Timeline Component Requirements

## Purpose
The Timeline component renders a git commit graph-like interface showing moments (nodes) connected by lanes (vertical lines) with branching and merging curves. It is generic and not tied to git — any data with parent-child relationships can be visualized.

## Data Model

### Moments
- Each moment has a unique `id`.
- Moments are provided in an array ordered **newest-first** (the first element renders at the top).
- A moment may have a **primary parent** (`parent`): the single older moment it directly continues from. The primary parent determines lane inheritance.
- A moment may have **ancillary parents** (`ancillaryParents`): additional older moments it connects to. These create merge/branch curves but do not affect lane inheritance.
- A moment may have no parent at all (root node).

### Primary Parent Rules
- Only **one child** may claim a given moment as its primary parent. If two children claim the same primary parent, the second is warned and its primary is demoted to ancillary.
- The primary parent inherits the child's lane (vertical continuation on the same column).
- There is no code that promotes an ancillary parent to primary if no primary is specified. A moment with no primary parent but with ancillary parents is valid.

### Ancillary Parent Rules
- Ancillary parents get their own separate lanes.
- If an ancillary parent is later claimed as a primary parent by another moment, the primary claim supersedes and the parent's lane is reassigned.

## Processing Pipeline

The `processMoments` function transforms raw moments into fully rendered data through five stages:

### Pass 1: Lane Assignment
- Lanes are assigned in a **top-to-bottom** pass (newest to oldest).
- Each moment either uses a pre-assigned lane (from a newer child's placeholder) or gets a new lane.
- A moment's **primary parent** inherits the moment's lane (same column, straight vertical line).
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
- Detects connections whose visual lines would pass through intervening moments on the connecting lane.
- Three resolution strategies, tried in order of preference:

  1. **Rerouted branch**: The child's lane has a collision but the parent's lane is clear between the two moments. The connection uses the parent's lane instead, with an **incoming connection** curve at the child's row. No lane shift needed.

  2. **Relocated merge**: The parent's lane (merge lane) has a collision but the child's lane is clear. The merge curve moves from the child's row to the **parent's row**, with the child's lane extended downward via through-lines. An incoming connection curve is added at the parent's row.

  3. **Routing lane** (last resort): Both lanes are blocked. All lanes >= the child's lane shift right by 1 to insert an empty **routing lane**. The connection becomes two-part: a branch curve at the parent's row to the routing lane, through-lines on the routing lane, and an incoming connection curve at the child's row from the routing lane.

- After collision resolution, lane segments are extended for:
  - Routing lane endpoints (routing lane active from child to parent row)
  - Relocated merges (child's lane extended to parent's row)
  - Normal branches (child's lane extended to the furthest parent's row)

### Pass 2: Build & Compute
- Creates `ProcessedMoment` entries with all rendering data.
- Classifies each ancillary/primary connection as a branch, merge, routed, rerouted, or relocated — and populates the corresponding arrays.
- Tracks **active lanes** top-to-bottom:
  - Lanes activate when a moment on that lane is processed, when a merge connection references the lane, or when an incoming connection references the lane.
  - Lanes deactivate at branch endpoints when the current lane segment ends at the current row.
  - Incoming connection lanes (fromAbove) deactivate when their segment ends.
- Detects **pass-throughs** (branch, merge, or incoming lanes that were already active and whose segment continues below).
- Computes `hasLineAbove` from the previous moment's `activeLanes` snapshot, with a segment-gap override: if the previous row's segment for this lane doesn't reach the current row, `hasLineAbove` is forced to false (prevents false connections between collapsed lane sections).

### Pass 3: hasLineBelow
- Requires the next moment's `activeLanes` snapshot (not available during Pass 2).
- `hasLineBelow` is true if this moment's lane is active in the next moment's snapshot.

## Visual Rendering

### Layout
- Each moment occupies a horizontal row.
- The row contains a **node column** (SVG graphics) and a **content column** (user-provided via render prop).
- Rows use `display: flex` with `align-items: stretch` so the node column matches the content height.

### Two-SVG Architecture
Each moment's node column contains two SVGs stacked vertically:

1. **Static SVG** (fixed 20px height, `flex-shrink: 0`):
   - Contains all complex graphics: through-lines, branch curves, merge curves, incoming connection curves, cutout mask, and the circle.
   - All coordinates are in a fixed `viewBox="0 0 W 20"` — no stretching.
   - Curves and lines share the same coordinate space, so they align perfectly.

2. **Variable SVG** (fills remaining height via `flex: 1`):
   - Contains only straight vertical through-lines for lanes that continue below.
   - Uses `preserveAspectRatio="none"` so lines stretch to fill available space.
   - When content is exactly 20px, this SVG has 0 height and renders nothing.

### Through-Lines
- Vertical lines representing lanes that pass through a moment's row.
- Drawn for all **active lanes** except:
  - Branch lanes (non-pass-through): the branch curve handles the visual connection.
  - Merge lanes (non-pass-through): the merge curve handles the visual connection.
  - Incoming connection lanes (non-pass-through): the incoming curve handles the visual connection.
  - Terminating incoming lanes: the lane ends here; the curve handles the visual and no through-line is needed even if pass-through.
  - The moment's own lane if it has nothing above AND below (isolated moment).
- **Half-lines** for lane endpoints:
  - `hasLineAbove = false`: line starts at y=10 (circle center) instead of y=0.
  - `hasLineBelow = false`: line ends at y=10 instead of y=20.
- In the **variable SVG**, through-lines are skipped for:
  - Branch lanes that are not pass-through (they end at this moment).
  - Terminating incoming lanes (the lane ends here, no through-line below).
  - The moment's own lane if `hasLineBelow` is false.

### Branch Curves
- Drawn on the **parent** moment's row.
- A branch means a child is on a different lane from the parent.
- The curve goes from the parent's circle area (y=10) **upward** to the child's lane (y=0).
- Uses a quadratic bezier that starts horizontal and turns vertical.
- For branches more than 1 lane away, a horizontal line bridges from the circle to the curve start.
- Rendered highest-lane-first so lower lanes draw on top.
- Branch lanes are created in two cases:
  1. A child's primary parent is on a different lane.
  2. A child lists a moment as an ancillary parent and that moment is on a **lower** lane.

### Merge Curves (From Above)
- Drawn on the **child** moment's row.
- A merge means an ancillary parent is on a **higher** lane than the child.
- The curve comes **down** from the parent's lane (y=20) and turns left toward the child's circle.
- Uses a quadratic bezier that starts vertical and turns horizontal.
- For merges more than 1 lane away, a horizontal line bridges from the curve end to the circle.

### Incoming Connection Curves
- Drawn at the target moment's row for rerouted branches, relocated merges, and routing lane connections.
- A vertical line on the incoming lane enters the row and curves toward the moment's circle.
- Two entry directions:
  - **fromAbove** (`y=0`): the vertical line enters from above (used for relocated merges where the child is above the parent).
  - **fromBelow** (`y=20`): the vertical line enters from below (used for rerouted branches and routing lane connections where the parent is below the child).
- Uses a quadratic bezier: `M incX,startY Q incX,10 adjacentX,10`.
- For connections more than 1 lane away, a horizontal bridge extends from the curve end to the moment's circle.
- Color uses the incoming lane's palette color.
- The `terminates` flag indicates whether the incoming lane ends at this row (no moments or connections on it below). Terminating incoming lanes skip through-lines in both the static and variable SVGs.

### Cutout Mask
- Each moment has an SVG mask that cuts out a circle around the dot.
- This prevents through-lines and curves from drawing over the circle.
- Mask IDs are unique per moment (using the array index) to avoid cross-SVG ID collisions in the document.
- Must use `maskUnits="userSpaceOnUse"` with explicit pixel dimensions for cross-browser compatibility.

### Circle
- Rendered **outside** the mask group so it draws on top of everything.
- Uses palette shade 600 (`--clr-plt-600`) for fill.
- Radius: 4px. Mask cutout radius: 6px (creates a gap between lines and circle).

### Colors
- Colors are provided as an array of palette color names (e.g., `['blue', 'purple', 'green']`).
- Each lane gets a color via `colors[laneIndex % colors.length]` (wraps around).
- Colors are applied as CSS classes (`ra-clr-plt-{name}`) on `<g>` elements wrapping SVG shapes.
- These classes set CSS custom properties `--clr-plt-100` through `--clr-plt-900`.
- Lines use shade 400 (`--clr-plt-400`), circles use shade 600 (`--clr-plt-600`).

### Active Lanes & Lane Segments
- A lane is **active** at a moment's row if it has been encountered and not yet deactivated.
- Lanes activate when a moment on that lane is processed, when a merge connection references that lane, or when an incoming connection references that lane.
- Lanes deactivate when the current lane segment ends:
  - At branch endpoints, if the branch lane's segment ends at or before this row.
  - At incoming connection endpoints (fromAbove), if the lane's segment ends at or before this row.
- **Lane segments** track discontinuous active ranges for collapsed lanes. A collapsed lane may have multiple segments (e.g., `[3,4]` and `[5,13]`). The `getSegmentEnd(lane, index)` function returns the end of the segment containing a given index, enabling segment-aware deactivation and pass-through detection.
- **Pass-through branches**: when a branch lane's current segment continues below this row, the through-line is drawn instead of being skipped.
- **Pass-through merges**: when a merge lane was already active before the merge activated it, the lane continues in both directions.
- **Pass-through incoming**: when an incoming connection lane was already active, the lane continues.

### hasLineAbove / hasLineBelow
- `hasLineAbove`: true if this moment's lane was active in the previous moment's `activeLanes` snapshot AND the previous row's lane segment reaches this row. The segment check prevents false connections between independent sections sharing a collapsed lane column.
- `hasLineBelow`: true if this moment's lane is active in the next moment's `activeLanes` snapshot. Controls whether the own-lane through-line ends at y=20 (full) or y=10 (half), and whether the variable SVG draws the own lane.

## Component API

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `moments` | `Moment[]` | `[]` | Array of moments ordered newest-first |
| `renderMoment` | `(moment, index) => ReactNode` | required | Render prop for moment content |
| `colors` | `string[]` | `[]` | Palette color names for lane coloring |

### Moment Interface
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `parent` | `string \| null \| undefined` | Primary parent moment ID |
| `ancillaryParents` | `string[]` (optional) | Additional parent moment IDs |

## Known Limitations / Future Work
- Lane width (`LANE_WIDTH = 12`) and SVG height (20px) are hardcoded constants, not configurable via props.
- The greedy interval coloring for lane collapsing may not always produce the optimal (minimum-width) result for all graph topologies.
- When both lanes of a connection are blocked by intervening moments, the routing lane shift increases graph width globally. A more targeted shift (only shifting affected rows) would be more compact but significantly more complex.
