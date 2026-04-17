import DateInputField from '../../../../../reactive/dist/components/fields/date-input-field';
import defaultStory from './stories/default.story';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    title: 'Fields/Date Input Field',
    component: DateInputField,
    // tags: ['autodocs'],
};

export const Default = {
    render: defaultStory,
    args: {},
};
