import DateRangeInput from '@reformjs/reactive/inputs/date-range-input';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Inputs/Date Range Input',
    component: DateRangeInput,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
