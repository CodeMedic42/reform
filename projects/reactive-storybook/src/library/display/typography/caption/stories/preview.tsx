import React from 'react';
import { Caption } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    const { label = 'Example', ...rest } = props;
    return (
        <Caption label={label as string} {...rest}>The quick brown fox jumps over the lazy dog.</Caption>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    label: 'Example',
};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    label: {
        control: 'text',
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
