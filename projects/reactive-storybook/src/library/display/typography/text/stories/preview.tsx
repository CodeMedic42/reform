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
    size: 'md',
    weight: 'normal',
    singleLine: false,
    applyMargin: false,
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
