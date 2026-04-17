import Button from '@reformjs/reactive/controls/button';
import defaultStory from './stories/default.story';

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
            control: 'text',
        },
        color: {
            control: 'text',
        },
        variant: {
            control: 'text',
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

export const Default = {
    render: defaultStory,
    args: {
        children: 'Text',
        disabled: false,
    },
};

export const Color = {
    args: {
        children: 'Button',
        color: 'primary',
    },
};

export const Design = {
    args: {
        children: 'Button',
        color: 'primary',
        design: 'fill',
    },
};
