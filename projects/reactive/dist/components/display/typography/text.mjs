import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { colorPropType, getColorInfo } from '../../../common/color-list.mjs';
import applyForwardRef from '../../../common/apply-forward-ref.mjs';

class Text extends PureComponent {
    render() {
        const { color, className, size, weight, children, style, applyMargin, singleLine, forwardRef, } = this.props;
        const sizeClass = !isNil(size) ? `size-${size}` : null;
        const weightClass = !isNil(weight) ? `weight-${weight}` : null;
        const { colorClasses } = getColorInfo({ color });
        return (React.createElement("span", { ref: forwardRef, className: classnames('ra-text', 'ra-typography', sizeClass, weightClass, colorClasses, className, {
                'apply-margin': applyMargin,
                'single-line': singleLine,
            }), style: style }, children));
    }
}
Text.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
    singleLine: PropTypes.bool,
    size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs']),
    weight: PropTypes.oneOf(['bold', 'semi-bold', 'normal']),
    color: colorPropType,
    applyMargin: PropTypes.bool,
    forwardRef: PropTypes.instanceOf(Object),
};
Text.defaultProps = {
    className: null,
    children: null,
    color: null,
    weight: null,
    size: null,
    singleLine: false,
    style: null,
    applyMargin: false,
    forwardRef: null,
};
var Text$1 = applyForwardRef(Text);

export { Text$1 as default };
