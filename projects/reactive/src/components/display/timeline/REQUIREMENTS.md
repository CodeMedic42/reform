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

## Lane Assignment

### Processing Direction
- Lanes are assigned in a **top-to-bottom** pass (newest to oldest).
- Each moment either uses a pre-assigned lane (from a newer child's placeholder) or gets a new lane.

### Lane Inheritance
- A moment's **primary parent** inherits the moment's lane (same column, straight vertical line).
- **Ancillary parents** receive new lanes via allocation.
- If a parent was previously assigned a lane via an ancillary reference and is later claimed as a primary parent, the primary supersedes. The parent's lane is reassigned to match the primary child's lane and the old lane is freed for reuse.

### Lane Reuse
- When a lane is freed (via reassignment), it goes into a pool and is reused before allocating new lane numbers. This keeps lane numbers compact.

## Visual Rendering

### Layout
- Each moment occupies a horizontal row.
- The row contains a **node column** (SVG graphics) and a **content column** (user-provided via render prop).
- Rows use `display: flex` with `align-items: stretch` so the node column matches the content height.

### Two-SVG Architecture
Each moment's node column contains two SVGs stacked vertically:

1. **Static SVG** (fixed 20px height, `flex-shrink: 0`):
   - Contains all complex graphics: through-lines, branch curves, merge curves, cutout mask, and the circle.
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
  - The moment's own lane if it has nothing above AND below (isolated moment).
- **Half-lines** for lane endpoints:
  - `hasLineAbove = false`: line starts at y=10 (circle center) instead of y=0.
  - `hasLineBelow = false`: line ends at y=10 instead of y=20.
- In the **variable SVG**, through-lines are skipped for:
  - Branch lanes (they end at this moment).
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

### Active Lanes
- A lane is **active** at a moment's row if it has been encountered and not yet deactivated.
- Lanes activate when a moment on that lane is processed or when a merge connection references that lane.
- Lanes deactivate at branch endpoints (the branch was born at this moment going upward; below this moment the lane doesn't exist).
- **Pass-through merges**: when a merge lane was already active before the merge activated it, the lane continues in both directions and gets a full through-line instead of being skipped.

### hasLineAbove / hasLineBelow
- `hasLineAbove`: true if this moment's lane was active in the previous moment's `activeLanes` snapshot. Controls whether the own-lane through-line starts at y=0 (full) or y=10 (half).
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
- Ancillary parents on **lower** lanes are handled as branches on the parent's row. A dedicated "merge from below" rendering path may be needed for some graph topologies.
- No collision detection for merge/branch lines crossing unaffiliated moments on the same lane. Was previously implemented but removed during the single-pass rewrite.
- Lane width (`LANE_WIDTH = 12`) and SVG height (20px) are hardcoded constants, not configurable via props.
