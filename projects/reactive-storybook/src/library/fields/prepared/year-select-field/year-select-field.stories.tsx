import YearSelectField from '@reformjs/reactive/fields/prepared/year-select-field';
import defaultStory from './stories/default.story';

export default {
    title: 'Fields/Prepared/Year Select Field',
    component: YearSelectField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {
        children: 'Text',
        disabled: false,
    },
};
