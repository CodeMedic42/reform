import React from 'react';
import Spinner from '@reformjs/reactive/display/spinner';

function example(props: Record<string, unknown>) {
    return (
        <Spinner {...props} />
    );
}

example.story = {
    name: 'Preview',
    parameters: {
        options: {
            showPanel: true,
        },
    },
    argTypes: {
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
            options: ['blue', 'purple', 'green', 'yellow', 'orange', 'red'],
            control: { type: 'select' },
            defaultValue: 'blue',
        },
    },
};

export default example;
