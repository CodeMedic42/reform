import React from 'react';
import { Paragraph } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    return (
        <Paragraph {...props}>The quick brown fox jumps over the lazy dog.</Paragraph>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    size: 2,
    weight: 'normal',
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
};

export default example;
