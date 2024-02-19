/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import Typography from './typography';
import applyForwardRef from '../../../common/apply-forward-ref';

class Caption extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        label: PropTypes.string.isRequired,
        forwardRef: PropTypes.instanceOf(Object),
    };

    static defaultProps = {
        className: null,
        children: null,
        forwardRef: null,
    };

    render() {
        const {
            className, label, forwardRef, children, ...rest
        } = this.props;

        const labelValue = !isNil(label) ? (
            <span className="ra-caption-label">
                {label}
                :
                {' '}
            </span>
        ) : null;

        return (
            <Typography
                ref={forwardRef}
                Component="div"
                className={classnames('ra-caption', className)}
                {...rest}
            >
                {labelValue}
                <span className="ra-caption-body">{children}</span>
            </Typography>
        );
    }
}

export default applyForwardRef(Caption);
