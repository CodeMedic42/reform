import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { colorPropType, getColorInfo } from '../../../common/color-list.mjs';
import applyForwardRef from '../../../common/apply-forward-ref.mjs';

/* eslint-disable react/jsx-props-no-spreading */
class Typography extends PureComponent {
    render() {
        const { className, inline, color, children, Component, forwardRef, ...rest } = this.props;
        const { colorClasses } = getColorInfo({ color });
        return (React.createElement(Component, { ref: forwardRef, className: classnames('ra-typography', className, colorClasses, { inline }), ...rest }, children));
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
var Typography$1 = applyForwardRef(Typography);

export { Typography$1 as default };
