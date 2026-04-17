import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import Typography from './typography.mjs';
import applyForwardRef from '../../../common/apply-forward-ref.mjs';

/* eslint-disable react/jsx-props-no-spreading */
class Caption extends PureComponent {
    render() {
        const { className, label, forwardRef, children, ...rest } = this.props;
        const labelValue = !isNil(label) ? (React.createElement("span", { className: "ra-caption-label" },
            label,
            ":",
            ' ')) : null;
        return (React.createElement(Typography, { ref: forwardRef, Component: "div", className: classnames('ra-caption', className), ...rest },
            labelValue,
            React.createElement("span", { className: "ra-caption-body" }, children)));
    }
}
Caption.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    label: PropTypes.string.isRequired,
    forwardRef: PropTypes.instanceOf(Object),
};
Caption.defaultProps = {
    className: null,
    children: null,
    forwardRef: null,
};
applyForwardRef(Caption);
