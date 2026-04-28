import React from 'react';
import Spinner from '@reformjs/reactive/display/spinner';
import { getPaletteColorOptions } from '../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    return (
        <Spinner {...props} />
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    size: {
        options: ['xl', 'lg', 'md', 'sm', 'xs'],
        control: { type: 'select' },
        defaultValue: 'md',
    },
    color: {
        options: getPaletteColorOptions(),
        control: { type: 'select' },
        defaultValue: 'blue',
    },
};

export default example;
