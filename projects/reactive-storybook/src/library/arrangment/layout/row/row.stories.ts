import defaultGutter from './stories/default.story';
import gutter4 from './stories/gutter-4.story';
import gutter8 from './stories/gutter-8.story';
import gutter16 from './stories/gutter-16.story';
import gutter24 from './stories/gutter-24.story';
import gutter32 from './stories/gutter-32.story';
import reflexiveGutter from './stories/reflexive-gutter.story';
import gutterHorizontal32 from './stories/gutter-horizontal-32.story';
import gutterVertical8 from './stories/gutter-vertical-8.story';
import gutterHorizontal32Vertical8 from './stories/gutter-horizontal-32-vertical-8.story';
import gutterHorizontalVerticalResponsive from './stories/gutter-horizontal-vertical-responsive.story';
import multipleGutterSizes from './stories/multiple-gutter-sizes.story';
import nestedRows from './stories/nested-rows.story';
import justification from './stories/justification.story';
import alignment from './stories/alignment.story';
import stylesBetweenRows from './stories/styles-between-rows.story';

export default {
    title: 'Arrangement/Layout/Row',
};

export const Default = {
    render: defaultGutter,
};

export const Gutter4 = {
    render: gutter4,
};

export const Gutter8 = {
    render: gutter8,
};

export const Gutter16 = {
    render: gutter16,
};

export const Gutter24 = {
    render: gutter24,
};

export const Gutter32 = {
    render: gutter32,
};

export const ReflexiveGutter = {
    render: reflexiveGutter,
};

export const GutterHorizontal32 = {
    render: gutterHorizontal32,
};

export const GutterVertical8 = {
    render: gutterVertical8,
};

export const GutterHorizontal32Vertical8 = {
    render: gutterHorizontal32Vertical8,
};

export const GutterHorizontalVerticalResponsive = {
    render: gutterHorizontalVerticalResponsive,
};

export const MultipleGutterSizes = {
    render: multipleGutterSizes,
};

export const NestedRows = {
    render: nestedRows,
};

export const Justification = {
    render: justification,
};

export const Alignment = {
    render: alignment,
};

export const StylesBetweenRows = {
    render: stylesBetweenRows,
};
