import React from 'react';
import { Overline } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    return (
        <Overline {...props}>The quick brown fox jumps over the lazy dog.</Overline>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
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
