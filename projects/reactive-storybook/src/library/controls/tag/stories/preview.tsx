import React, { useCallback } from 'react';
import Tag from '@reformjs/reactive/controls/tag';
import { getPaletteColorOptions } from '../../../../common/config-colors';

function example(props: Record<string, unknown>) {
    const handleOnClear = useCallback(() => {
        alert('Clear called.');
    }, []);

    return (
        <Tag {
            ...props}
            onClear={handleOnClear}
        >
            Text
        </Tag>
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
