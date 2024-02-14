import InputLabel from '@reformjs/reactive/inputs/base/input-label';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Inputs/Base/Input Label',
    component: InputLabel,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
