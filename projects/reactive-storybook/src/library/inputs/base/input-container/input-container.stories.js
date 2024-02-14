import InputContainer from '@reformjs/reactive/inputs/base/input-container';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Inputs/Base/Input Container',
    component: InputContainer,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
