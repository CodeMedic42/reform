import React, { PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import Icon from '../icon/index';
import PropTypes from '../../../common/prop-types';
import {
    schemeColorPropType,
    getSchemeColorClasses,
} from '../../../common/color-list';

class IconBox extends PureComponent {
    render() {
        const {
            id,
            className,
            style,
            'aria-label': ariaLabel,
            title,
            icon,
            size,
            color,
            hidden,
            alignToIcon,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';

        const colorClasses = getSchemeColorClasses({ color });

        return (
            <span
                id={id}
                style={style}
                className={classnames(
                    className,
                    'ra-icon-box',
                    sizeClass,
                    colorClasses,
                    {
                        hidden,
                        'align-to-icon': alignToIcon,
                    },
                )}
                aria-label={ariaLabel}
                title={title}
            >
                <Icon icon={icon} color={color} />
            </span>
        );
    }
}

IconBox.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
    'aria-label': PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.icon.isRequired,
    size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
    color: schemeColorPropType,
    hidden: PropTypes.bool,
    alignToIcon: PropTypes.bool,
};

IconBox.defaultProps = {
    id: '',
    className: '',
    style: null,
    'aria-label': null,
    title: null,
    size: 'md',
    color: null,
    hidden: false,
    alignToIcon: false,
};

export default IconBox;
