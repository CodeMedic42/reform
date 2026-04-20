import DateRangeInputField from '@reformjs/reactive/fields/date-range-input-field';
import defaultStory from './stories/default.story';

export default {
    title: 'Fields/Date Range Input Field',
    component: DateRangeInputField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
