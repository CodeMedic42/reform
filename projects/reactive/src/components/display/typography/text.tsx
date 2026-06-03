import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { PaletteColor, PaletteShade } from '../../../common/color-list.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';
import Typography from './typography.js';

import type { TypographyProps } from './typography.js';

export interface TextProps extends Omit<TypographyProps<'span'>, 'Component'> {
    className?: string | null;
    children?: React.ReactNode;
    style?: React.CSSProperties | null;
    singleLine?: boolean;
    size?: number | null;
    weight?: 'bold' | 'semi-bold' | 'normal' | null;
    color?: PaletteColor | null;
    shade?: PaletteShade | null;
    applyMargin?: boolean;
    responsive?: boolean;
}

interface InternalTextProps extends TextProps {
    forwardRef?: React.Ref<HTMLSpanElement> | null;
}

class Text extends PureComponent<InternalTextProps> {
    render(): React.ReactNode {
        const {
            className = null,
            size = null,
            weight = null,
            children = null,
            applyMargin = false,
            singleLine = false,
            responsive = false,
            forwardRef = null,
            ...rest
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : null;
        const weightClass = !isNil(weight) ? `weight-${weight}` : null;

        return (
            <Typography
                ref={forwardRef}
                className={classnames(
                    'ra-text',
                    sizeClass,
                    weightClass,
                    // colorClasses,
                    className,
                    {
                        'apply-margin': applyMargin,
                        'single-line': singleLine,
                        responsive,
                    },
                )}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(Text);
