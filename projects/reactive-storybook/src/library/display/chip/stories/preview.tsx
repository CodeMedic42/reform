import React from 'react';
import Chip from '@reformjs/reactive/display/chip';
import { getPaletteColorOptions } from '../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    return (
        <Chip {...props}>Text</Chip>
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
    color: 'blue',
    shade: '500',
    variant: 'rectangle',
    bordered: false,
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
    color: {
        options: getPaletteColorOptions(),
        control: { type: 'select' },
    },
    shade: {
        options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        control: { type: 'select' },
    },
    variant: {
        options: ['rectangle', 'pill'],
        control: { type: 'select' },
    },
    bordered: {
        control: 'boolean',
    },
};

export default example;
