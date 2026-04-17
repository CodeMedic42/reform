import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Typography from './typography.mjs';
import applyForwardRef from '../../../common/apply-forward-ref.mjs';

/* eslint-disable react/jsx-props-no-spreading */
class SubHeading extends PureComponent {
    render() {
        const { className, children, level, weightNormal, forwardRef, responsive, ...rest } = this.props;
        return (React.createElement(Typography, { ref: forwardRef, Component: "div", className: classnames('ra-sub-heading', className, `level-${level}`, {
                'weight-normal': weightNormal,
                responsive,
            }), ...rest }, children));
    }
}
SubHeading.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    level: PropTypes.oneOf(['1', '2', '3', '4', '5']).isRequired,
    forwardRef: PropTypes.instanceOf(Object),
    weightNormal: PropTypes.bool,
    responsive: PropTypes.bool,
};
SubHeading.defaultProps = {
    className: null,
    children: null,
    forwardRef: null,
    weightNormal: false,
    responsive: false,
};
applyForwardRef(SubHeading);
