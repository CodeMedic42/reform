import React from 'react';
import Badge from '@reformjs/reactive/display/badge';
import { getPaletteColorOptions } from '../../../../common/config-colors';

const placeholderStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 48,
    height: 48,
    border: '1px solid #ccc',
    borderRadius: 4,
};

function example(props: Record<string, unknown>) {
    return (
        <div
            style={{
                padding: 24,
            }}
        >
            <Badge {...props}>
                <span style={placeholderStyle} />
            </Badge>
        </div>
    );
}

example.storyName = 'Preview';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    value: '99',
    color: 'blue',
    shade: '500',
    position: 'top-right',
};
example.argTypes = {
    id: {
        control: 'text',
    },
    className: {
        control: 'text',
    },
    value: {
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
    position: {
        options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        control: { type: 'select' },
    },
};

export default example;
