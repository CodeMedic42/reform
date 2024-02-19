import React from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import Icon from '../icon';
import PropTypes from '../../../common/prop-types';
import {
    schemeColorPropType,
    getSchemeColorClasses,
} from '../../../common/color-list';

class IconButton extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        // eslint-disable-next-line react/forbid-prop-types
        style: PropTypes.object,
        'aria-label': PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.icon,
        size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
        variant: PropTypes.oneOf([
            'none',
            'fill',
            'outline',
            'opaque',
            'fill-dark',
        ]),
        shape: PropTypes.oneOf(['circle', 'square']),
        color: schemeColorPropType,
        hidden: PropTypes.bool,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onKeyUp: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyPress: PropTypes.func,
        onMouseDown: PropTypes.func,
        tabIndex: PropTypes.string,
        alignToIcon: PropTypes.bool,
        children: PropTypes.node,
        disableControlFeatures: PropTypes.bool,
        responsive: PropTypes.bool,
    };

    static defaultProps = {
        id: null,
        className: null,
        style: null,
        icon: null,
        'aria-label': null,
        title: null,
        size: 'md',
        color: null,
        shape: 'circle',
        variant: 'opaque',
        hidden: false,
        disabled: false,
        onClick: null,
        onFocus: null,
        onBlur: null,
        onKeyUp: null,
        onKeyPress: null,
        onKeyDown: null,
        tabIndex: null,
        onMouseDown: null,
        alignToIcon: false,
        children: null,
        disableControlFeatures: false,
        responsive: false,
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    renderIcon() {
        const { icon, children } = this.props;

        if (!isNil(children)) {
            return children;
        }

        return <Icon icon={icon} />;
    }

    render() {
        const {
            id,
            className,
            style,
            'aria-label': ariaLabel,
            title,
            size,
            color,
            hidden,
            disabled,
            onFocus,
            onBlur,
            onKeyUp,
            onKeyDown,
            onKeyPress,
            variant,
            shape,
            tabIndex,
            onMouseDown,
            alignToIcon,
            disableControlFeatures,
            responsive,
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
                id={id}
                style={style}
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
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                title={title}
                disabled={disabled}
                onClick={this.handleClick}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyUp={onKeyUp}
                onKeyPress={onKeyPress}
                onKeyDown={onKeyDown}
                onMouseDown={onMouseDown}
            >
                {floatBoxSizer}
                {this.renderIcon()}
            </button>
        );
    }
}

export default IconButton;
