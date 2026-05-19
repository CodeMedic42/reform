/** Horizontal pixel width of each lane column */
const LANE_WIDTH = 12;
/** X offset from the left edge of a lane to its center (where lines and circles draw) */
const LANE_CENTER = LANE_WIDTH / 2;
/** CSS custom property for line stroke color (palette shade 400) */
const LINE_STROKE = 'var(--clr-plt-400)';
/** CSS custom property for circle fill color (palette shade 600) */
const CIRCLE_FILL = 'var(--clr-plt-600)';

export { LANE_WIDTH, LANE_CENTER, LINE_STROKE, CIRCLE_FILL };