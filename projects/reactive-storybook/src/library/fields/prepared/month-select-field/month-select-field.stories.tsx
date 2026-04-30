import MonthSelectField from '@reformjs/reactive/fields/prepared/month-select-field';
import defaultStory from './stories/default.story';

export default {
    title: 'Fields/Prepared/Month Select Field',
    component: MonthSelectField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {
        children: 'Text',
        disabled: false,
    },
};
