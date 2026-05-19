import DateRangeSelectField from '@reformjs/reactive/fields/date-range-select-field';
import defaultStory from './stories/default.story';

export default {
    title: 'Fields/Date Range Select Field',
    component: DateRangeSelectField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
