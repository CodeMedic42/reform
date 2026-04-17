/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Spinner from '@reformjs/reactive/display/spinner';

function example(props) {
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
    },
};

export default example;
