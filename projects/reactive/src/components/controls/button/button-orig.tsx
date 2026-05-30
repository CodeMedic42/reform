import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import {
    getSchemeColorClasses,
} from '../../../common/color-list.js';
// import Icon from '../icon';

interface ButtonOrigProps {
    id?: string | null;
    className?: string | null;
    type?: string | null;
    color?: string | null;
    variant?: 'none' | 'fill' | 'outline' | 'opaque' | null;
    useDark?: boolean;
    size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs' | null;
    onClick?: ((event: React.MouseEvent) => void) | null;
    children?: React.ReactNode;
    rounded?: boolean;
    noPadding?: boolean;
    dockSide?: 'left' | 'right' | 'top' | 'bottom' | null;
    asAnchor?: boolean;
    href?: string | null;
    target?: string | null;
    focusOnMount?: boolean;
}

class Button extends PureComponent<ButtonOrigProps> {
    private buttonRef: React.RefObject<HTMLElement>;

    constructor(props: ButtonOrigProps) {
        super(props);

        this.buttonRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(): void {
        const { focusOnMount } = this.props;

        if (focusOnMount) {
            this.focus();
        }
    }

    handleClick(event: React.MouseEvent): void {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    getRootNode(): HTMLElement | null {
        return this.buttonRef.current;
    }

    focus(): void {
        const { current } = this.buttonRef;

        if (isNil(current)) {
            console.warn('Attempting to focus on an unmounted component');

            return;
        }

        current.focus();
    }

    // renderLeftIcon() {
    //     const { leftIcon } = this.props;

    //     if (isNil(leftIcon)) {
    //         return null;
    //     }

    //     return <Icon icon={leftIcon} />;
    // }

    // renderRightIcon() {
    //     const { rightIcon } = this.props;

    //     if (isNil(rightIcon)) {
    //         return null;
    //     }

    //     return <Icon icon={rightIcon} />;
    // }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            variant = 'fill',
            color = null,
            children = null,
            rounded = false,
            size = 'md',
            type = 'button',
            noPadding = false,
            dockSide = null,
            asAnchor = false,
            href = null,
            target = null,
            useDark = false,
            // leftIcon,
            // rightIcon,
            // @typescript-eslint/no-unused-vars
            onClick: _onClick,
            // @typescript-eslint/no-unused-vars
            focusOnMount = false,
            ...rest
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';
        const dockClass = !isNil(dockSide) ? `dock-${dockSide}` : null;

        const colorClasses = getSchemeColorClasses({
            colorRequired: false,
            color,
            variant: !isNil(variant) ? variant : 'fill',
        });

        const content = (
            <>
                {/* {this.renderLeftIcon()} */}
                <span>{children}</span>
                {/* {this.renderRightIcon()} */}
            </>
        );

        const props = {
            ref: this.buttonRef as unknown as React.RefObject<HTMLAnchorElement> & React.RefObject<HTMLButtonElement>,
            id: id ?? undefined,
            className: classnames(
                'ra-button',
                'no-select',
                'ra-clr-int-control',
                sizeClass,
                colorClasses,
                dockClass,
                className,
                {
                    'border-radius-lg': rounded,
                    'border-radius-sm': !rounded,
                    dark: useDark,
                    'no-padding': noPadding,
                },
            ),
            onClick: this.handleClick,
            ...rest,
        };

        if (asAnchor) {
            return (
                <a {...props} href={href ?? undefined} target={target ?? undefined}>
                    {content}
                </a>
            );
        }

        const typeProp = (!isNil(type) ? type : 'button') as "button" | "reset" | "submit";

        return (
            <button {...props} type={typeProp}>
                {content}
            </button>
        );
    }
}

export default Button;
