import DateSelectField from "@reformjs/reactive/fields/date-single-select-field";
import defaultStory from './stories/default.story';

export default {
    title: 'Fields/Date Select Field',
    component: DateSelectField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
