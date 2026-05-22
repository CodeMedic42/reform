import PanelGroup from '@reformjs/reactive/arrangement/panel-group';
import previewStory from './stories/preview.story';
import verticalStory from './stories/vertical.story';

export default {
    title: 'Arrangement/PanelGroup',
    component: PanelGroup,
};

export const Default = {
    render: previewStory,
};

export const Vertical = {
    render: verticalStory,
};