import React from 'react';
import { Text } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    return (
        <Text {...props}>The quick brown fox jumps over the lazy dog.</Text>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    size: 3,
    weight: 'normal',
    singleLine: false,
    applyMargin: false,
    responsive: false,
};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    size: {
        control: { type: 'number', min: 1 },
    },
    responsive: {
        control: 'boolean',
    },
    weight: {
        options: ['bold', 'semi-bold', 'normal'],
        control: { type: 'select' },
    },
    color: {
        options: getPaletteColorOptions(),
        control: { type: 'select' },
    },
    shade: {
        options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        control: { type: 'select' },
    },
    singleLine: {
        control: 'boolean',
    },
    applyMargin: {
        control: 'boolean',
    },
};

export default example;
