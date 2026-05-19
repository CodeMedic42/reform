import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { PaletteColor, PaletteShade, getColorInfo } from '../../../common/color-list.js';
import applyForwardRef from '../../../common/apply-forward-ref.js';

export interface TypographyProps<T extends React.ElementType = React.ElementType> {
    className?: string | null;
    children?: React.ReactNode;
    color?: PaletteColor | null;
    shade?: PaletteShade | null;
    Component?: T;
    inline?: boolean;
    [key: string]: unknown;
}

interface InternalTypographyProps<T extends React.ElementType = React.ElementType> extends TypographyProps<T> {
    forwardRef?: React.Ref<React.ComponentRef<T>> | null;
}

class Typography<T extends React.ElementType = React.ElementType> extends PureComponent<InternalTypographyProps<T>> {
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
                ref={forwardRef as React.Ref<any>}
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

interface TypographyWithRef {
    <T extends React.ElementType = 'span'>(
        props: TypographyProps<T> & React.RefAttributes<React.ComponentRef<T>>
    ): React.ReactElement | null;
    displayName?: string;
}

export default applyForwardRef<InternalTypographyProps, TypographyWithRef>(Typography);
