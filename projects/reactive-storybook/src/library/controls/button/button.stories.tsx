import Button from '@reformjs/reactive/controls/button';
import { getInteractiveColorOptions, getButtonVariantOptions, getInteractiveDesignOptions } from '../../../common/config-colors';
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
            options: getInteractiveDesignOptions(),
            control: 'select',
        },
        color: {
            options: getInteractiveColorOptions(),
            control: 'select',
        },
        variant: {
            options: getButtonVariantOptions(),
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

