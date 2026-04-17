import React from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../icon/index.js';
import {
    SchemeColor,
    getSchemeColorClasses,
} from '../../../common/color-list.js';

interface IconButtonProps {
    id?: string | null;
    className?: string | null;
    style?: React.CSSProperties | null;
    'aria-label'?: string | null;
    title?: string | null;
    icon?: IconProp | null;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    variant?: 'none' | 'fill' | 'outline' | 'opaque' | 'fill-dark';
    shape?: 'circle' | 'square';
    color?: SchemeColor | null;
    hidden?: boolean;
    disabled?: boolean;
    onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    onFocus?: ((event: React.FocusEvent<HTMLButtonElement>) => void) | null;
    onBlur?: ((event: React.FocusEvent<HTMLButtonElement>) => void) | null;
    onKeyUp?: ((event: React.KeyboardEvent<HTMLButtonElement>) => void) | null;
    onKeyDown?: ((event: React.KeyboardEvent<HTMLButtonElement>) => void) | null;
    onKeyPress?: ((event: React.KeyboardEvent<HTMLButtonElement>) => void) | null;
    onMouseDown?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | null;
    tabIndex?: string | null;
    alignToIcon?: boolean;
    children?: React.ReactNode;
    disableControlFeatures?: boolean;
    responsive?: boolean;
}

class IconButton extends React.Component<IconButtonProps> {
    constructor(props: IconButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    renderIcon(): React.ReactNode {
        const { icon = null, children = null } = this.props;

        if (!isNil(children)) {
            return children;
        }

        return <Icon icon={icon!} />;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            style = null,
            'aria-label': ariaLabel = null,
            title = null,
            size = 'md',
            color = null,
            hidden = false,
            disabled = false,
            onFocus = null,
            onBlur = null,
            onKeyUp = null,
            onKeyDown = null,
            onKeyPress = null,
            variant = 'opaque',
            shape = 'circle',
            tabIndex = null,
            onMouseDown = null,
            alignToIcon = false,
            disableControlFeatures = false,
            responsive = false,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-xl';
        const shapeClass = !isNil(shape) ? `shp-${shape}` : 'shp-circle';

        const floatBoxSizer = alignToIcon ? (
            <span className="border-target" />
        ) : null;

        const colorClasses = getSchemeColorClasses({
            colorRequired: false,
            color,
            design: !isNil(variant) ? variant : 'sch-opaque',
        });

        return (
            <button
                id={id ?? undefined}
                style={style ?? undefined}
                className={classnames(
                    className,
                    'ra-icon-btn',
                    'ra-icon-box',
                    sizeClass,
                    colorClasses,
                    shapeClass,
                    {
                        hidden,
                        responsive,
                        'sch-control': !disableControlFeatures,
                        'align-to-icon': alignToIcon,
                        'border-target': !alignToIcon,
                    },
                )}
                type="button"
                tabIndex={tabIndex != null ? Number(tabIndex) : undefined}
                aria-label={ariaLabel ?? undefined}
                title={title ?? undefined}
                disabled={disabled}
                onClick={this.handleClick}
                onFocus={onFocus ?? undefined}
                onBlur={onBlur ?? undefined}
                onKeyUp={onKeyUp ?? undefined}
                onKeyPress={onKeyPress ?? undefined}
                onKeyDown={onKeyDown ?? undefined}
                onMouseDown={onMouseDown ?? undefined}
            >
                {floatBoxSizer}
                {this.renderIcon()}
            </button>
        );
    }
}

export default IconButton;
