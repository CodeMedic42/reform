import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { PaletteColor, PaletteShade, getColorInfo } from '../../../common/color-list.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

export interface TypographyProps {
    className?: string | null;
    children?: React.ReactNode;
    color?: PaletteColor | null;
    shade?: PaletteShade | null;
    Component?: React.ElementType;
    forwardRef?: React.Ref<unknown> | null;
    inline?: boolean;
    [key: string]: unknown;
}

class Typography extends PureComponent<TypographyProps> {
    render(): React.ReactNode {
        const {
            className = null,
            inline = false,
            color = null,
            shade = null,
            children = null,
            Component = 'span',
            forwardRef = null,
            ...rest
        } = this.props;

        const { colorClasses } = getColorInfo({ color, shade });

        return (
            <Component
                ref={forwardRef}
                className={classnames(
                    'ra-typography',
                    className,
                    colorClasses,
                    { inline },
                )}
                {...rest}
            >
                {children}
            </Component>
        );
    }
}

export default applyForwardRef(Typography);
