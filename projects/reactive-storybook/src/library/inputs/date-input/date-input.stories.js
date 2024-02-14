import DateInput from '@reformjs/reactive/inputs/date-input';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Inputs/Date Input',
    component: DateInput,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
