import PanelGroup from '@reformjs/reactive/arrangement/panel-group';
import horizontalStory from './stories/horizontal.story';
import verticalStory from './stories/vertical.story';

export default {
    title: 'Arrangement/PanelGroup',
    component: PanelGroup,
};

export const Horizontal = {
    render: horizontalStory,
};

export const Vertical = {
    render: verticalStory,
};