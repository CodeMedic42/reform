import DatePicker from '@reformjs/reactive/controls/date-picker';
import defaultStory from './stories/default.story';

export default {
    title: 'Controls/Date Picker',
    component: DatePicker,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {
        children: 'Text',
        disabled: false,
    },
};
