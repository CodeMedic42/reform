import React from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { PaletteColor } from '../../../common/color-list.js';

interface SpinnerProps {
    id?: string | null;
    className?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: PaletteColor | null;
}

function Spinner(props: SpinnerProps): React.ReactNode {
    const {
        id = null, className = null, size = 'md', color = 'blue',
    } = props;

    const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';

    return (
        <span
            id={id ?? undefined}
            className={classnames(
                'ra-spinner',
                `color-${color === null ? 'blue' : color}`,
                sizeClass,
                className,
            )}
        />
    );
}

export default Spinner;
