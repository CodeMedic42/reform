/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import {
    schemeColorPropType,
    getSchemeColorClasses,
} from '../../../common/color-list';
// import Icon from '../icon';
import PropTypes from '../../../common/prop-types';

class Button extends PureComponent {
    constructor(props) {
        super(props);

        this.buttonRef = React.createRef();

        this.focus = this.focus.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const { focusOnMount } = this.props;

        if (focusOnMount) {
            this.focus();
        }
    }

    handleClick(event) {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    getRootNode() {
        return this.buttonRef.current;
    }

    focus() {
        const { current } = this.buttonRef;

        if (isNil(current)) {
            // eslint-disable-next-line no-console
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

    render() {
        const {
            id,
            className,
            variant,
            color,
            children,
            rounded,
            size,
            type,
            noPadding,
            dockSide,
            asAnchor,
            href,
            target,
            useDark,
            // leftIcon,
            // rightIcon,
            // onClick,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            focusOnMount,
            ...rest
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';
        const dockClass = !isNil(dockSide) ? `dock-${dockSide}` : null;

        const colorClasses = getSchemeColorClasses({
            colorRequired: false,
            color,
            design: !isNil(variant) ? variant : 'fill',
        });

        const content = (
            <>
                {/* {this.renderLeftIcon()} */}
                <span>{children}</span>
                {/* {this.renderRightIcon()} */}
            </>
        );

        const props = {
            ref: this.buttonRef,
            id,
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
                <a {...props} href={href} target={target}>
                    {content}
                </a>
            );
        }

        const typeProp = !isNil(type) ? type : 'button';

        return (
            <button {...props} type={typeProp}>
                {content}
            </button>
        );
    }
}

Button.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    color: schemeColorPropType,
    variant: PropTypes.oneOf(['none', 'fill', 'outline', 'opaque']),
    useDark: PropTypes.bool,
    size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs', '2xs']),
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    rounded: PropTypes.bool,
    noPadding: PropTypes.bool,
    dockSide: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    asAnchor: PropTypes.bool,
    href: PropTypes.string,
    target: PropTypes.string,
    focusOnMount: PropTypes.bool,
};

Button.defaultProps = {
    id: null,
    type: 'button',
    className: null,
    variant: 'fill',
    color: null,
    onClick: null,
    children: null,
    rounded: false,
    size: 'md',
    noPadding: false,
    dockSide: null,
    asAnchor: false,
    href: null,
    target: null,
    useDark: false,
    focusOnMount: false,
};

export default Button;
