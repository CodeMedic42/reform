import React from 'react';
import { Heading } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    const { level = 1, ...rest } = props;
    return (
        <Heading level={level as number} {...rest}>The quick brown fox jumps over the lazy dog.</Heading>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    level: 1,
    responsive: false,
};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    level: {
        control: { type: 'number', min: 1 },
    },
    responsive: {
        control: 'boolean',
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
