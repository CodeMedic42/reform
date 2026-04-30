import React from 'react';
import { SubHeading } from '@reformjs/reactive/display/typography';
import { getPaletteColorOptions } from '../../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    const { level = '1', ...rest } = props;
    return (
        <SubHeading level={level as '1' | '2' | '3' | '4' | '5'} {...rest}>The quick brown fox jumps over the lazy dog.</SubHeading>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    level: '1',
    weightNormal: false,
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
        options: ['1', '2', '3', '4', '5'],
        control: { type: 'select' },
    },
    weightNormal: {
        control: 'boolean',
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
