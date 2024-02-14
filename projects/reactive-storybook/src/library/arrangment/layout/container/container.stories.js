import defaultGutter from './stories/default.story';
import gutter16 from './stories/gutter-16.story';
import gutter24 from './stories/gutter-24.story';
import gutter32 from './stories/gutter-32.story';
import gutter8 from './stories/gutter-8';
import hideOverflow from './stories/hide-overflow';
import reflexiveGutter from './stories/reflexive-gutter';

export default {
    title: 'Arrangement/Layout/Container',
};

export const DefaultGutter = {
    render: defaultGutter,
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

export const HideOverflow = {
    render: hideOverflow,
};
