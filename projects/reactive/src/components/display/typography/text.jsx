import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { colorPropType, getColorInfo } from '../../../common/color-list';
import applyForwardRef from '../../../common/apply-forward-ref';

class Text extends PureComponent {
    static propTypes = {
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

    static defaultProps = {
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

    render() {
        const {
            color,
            className,
            size,
            weight,
            children,
            style,
            applyMargin,
            singleLine,
            forwardRef,
        } = this.props;

        const sizeClass = !isNil(size) ? `size-${size}` : null;
        const weightClass = !isNil(weight) ? `weight-${weight}` : null;
        const { colorClasses } = getColorInfo({ color });

        return (
            <span
                ref={forwardRef}
                className={classnames(
                    'ra-text',
                    'ra-typography',
                    sizeClass,
                    weightClass,
                    colorClasses,
                    className,
                    {
                        'apply-margin': applyMargin,
                        'single-line': singleLine,
                    },
                )}
                style={style}
            >
                {children}
            </span>
        );
    }
}

export default applyForwardRef(Text);
