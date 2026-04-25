import Button from '@reformjs/reactive/controls/button';
import previewStory from './stories/preview.story';

export default {
    title: 'Controls/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
        },
        children: {
            control: 'text',
        },
        design: {
            options: ['fill'],
            control: 'select',
        },
        color: {
            options: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warn', 'danger'],
            control: 'select',
        },
        variant: {
            options: ['sm', 'lg-long'],
            control: 'select',
        },
        disabled: {
            control: 'boolean',
        },
        focusOnMount: {
            control: 'boolean',
        },
        Component: {
            control: 'text',
        },
    },
};

export const Preview = {
    render: previewStory,
    args: {
        children: 'Text',
        disabled: false,
    },
};

