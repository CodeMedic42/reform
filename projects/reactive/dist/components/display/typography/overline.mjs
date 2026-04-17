import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Typography from './typography.mjs';
import applyForwardRef from '../../../common/apply-forward-ref.mjs';

/* eslint-disable react/jsx-props-no-spreading */
class Overline extends PureComponent {
    render() {
        const { className, children, forwardRef, ...rest } = this.props;
        return (React.createElement(Typography, { ref: forwardRef, className: classnames('ra-overline', className), ...rest }, children));
    }
}
Overline.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    forwardRef: PropTypes.instanceOf(Object),
};
Overline.defaultProps = {
    className: null,
    children: null,
    forwardRef: null,
};
applyForwardRef(Overline);
