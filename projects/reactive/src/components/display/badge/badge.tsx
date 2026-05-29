import React, { memo, forwardRef } from 'react';
import classnames from 'classnames';
import { isNil, isString } from 'lodash-es';
import {
    PaletteColor,
    PaletteShade,
    getColorInfo,
} from '../../../common/color-list.js';

export interface BadgeProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    value?: string | React.ReactNode;
    color?: PaletteColor | null;
    shade?: PaletteShade | null;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;
}

const Badge = memo(forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
    const {
        id = null,
        className = null,
        children = null,
        value = null,
        color = 'blue',
        shade = '500',
        position = 'top-right',
    } = props;

    const { colorClasses } = getColorInfo({
        color,
        shade,
        enableBackground: true,
        colorRequired: false,
    });

    const isStringValue = isString(value);

    const rootClassName = classnames('ra-badge', className);

    const valueClassName = classnames(
        'ra-badge-value',
        `position-${position ?? 'top-right'}`,
        {
            'ra-badge-tag': isStringValue,
            [colorClasses]: isStringValue && colorClasses.length > 0,
        },
    );

    return (
        <span
            id={id ?? undefined}
            ref={ref}
            className={rootClassName}
        >
            {children}
            {!isNil(value) && (
                <span className={valueClassName}>
                    {value}
                </span>
            )}
        </span>
    );
}));

Badge.displayName = 'Badge';

export default Badge;
