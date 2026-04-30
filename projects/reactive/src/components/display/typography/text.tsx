import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { PaletteColor, PaletteShade, getColorInfo } from '../../../common/color-list.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

interface TextProps {
    className?: string | null;
    children?: React.ReactNode;
    style?: React.CSSProperties | null;
    singleLine?: boolean;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | null;
    weight?: 'bold' | 'semi-bold' | 'normal' | null;
    color?: PaletteColor | null;
    shade?: PaletteShade | null;
    applyMargin?: boolean;
    forwardRef?: React.Ref<HTMLSpanElement> | null;
}

class Text extends PureComponent<TextProps> {
    render(): React.ReactNode {
        const {
            color = null,
            shade = null,
            className = null,
            size = null,
            weight = null,
            children = null,
            style = null,
            applyMargin = false,
            singleLine = false,
            forwardRef = null,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : null;
        const weightClass = !isNil(weight) ? `weight-${weight}` : null;
        const { colorClasses } = getColorInfo({ color, shade });

        return (
            <span
                ref={forwardRef}
                className={classnames(
                    'ra-text',
                    'ra-typography',
                    sizeClass,
                    weightClass,
                    colorClasses,
                    className,
                    {
                        'apply-margin': applyMargin,
                        'single-line': singleLine,
                    },
                )}
                style={style ?? undefined}
            >
                {children}
            </span>
        );
    }
}

export default applyForwardRef(Text);
