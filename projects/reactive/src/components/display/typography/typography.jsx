/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { colorPropType, getColorInfo } from '../../../common/color-list';
import applyForwardRef from '../../../common/apply-forward-ref';

class Typography extends PureComponent {
    render() {
        const {
            className,
            inline,
            color,
            children,
            Component,
            forwardRef,
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

Typography.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    color: colorPropType,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    forwardRef: PropTypes.instanceOf(Object),
    inline: PropTypes.bool,
};

Typography.defaultProps = {
    className: null,
    children: null,
    color: null,
    Component: 'span',
    forwardRef: null,
    inline: false,
};

export default applyForwardRef(Typography);
