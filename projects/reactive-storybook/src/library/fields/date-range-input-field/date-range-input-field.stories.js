import DateRangeInputField from '../../../../../reactive/dist/components/fields/date-range-input-field';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Fields/Date Range Input Field',
    component: DateRangeInputField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
