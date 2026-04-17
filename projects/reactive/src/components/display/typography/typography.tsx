/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Color, getColorInfo } from '../../../common/color-list.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

interface TypographyProps {
    className?: string | null;
    children?: React.ReactNode;
    color?: Color | null;
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
            children = null,
            Component = 'span',
            forwardRef = null,
            ...rest
        } = this.props;

        const { colorClasses } = getColorInfo({ color });

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
