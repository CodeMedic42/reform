import React from 'react';
import Badge from '@reformjs/reactive/display/badge';
import Spinner from '@reformjs/reactive/display/spinner';
import { getPaletteColorOptions } from '../../../../common/config-colors';

const placeholderStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 48,
    height: 48,
    border: '1px solid #ccc',
    borderRadius: 4,
};

function example({ position, spinnerSize, spinnerColor }: Record<string, any>) {
    return (
        <div
            style={{
                padding: 24,
            }}
        >
            <Badge
                position={position}
                value={<Spinner size={spinnerSize} color={spinnerColor} />}
            >
                <span style={placeholderStyle} />
            </Badge>
        </div>
    );
}

example.storyName = 'Spinner';
example.parameters = {
    options: {
        showPanel: true,
    },
};
example.args = {
    position: 'top-right',
    spinnerSize: 'sm',
    spinnerColor: 'blue',
};
example.argTypes = {
    position: {
        options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        control: { type: 'select' },
    },
    spinnerSize: {
        options: ['xl', 'lg', 'md', 'sm', 'xs'],
        control: { type: 'select' },
    },
    spinnerColor: {
        options: getPaletteColorOptions(),
        control: { type: 'select' },
    },
};

export default example;
