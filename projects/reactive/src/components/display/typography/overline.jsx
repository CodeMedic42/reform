/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Typography from './typography';
import applyForwardRef from '../../../common/apply-forward-ref';

class Overline extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        forwardRef: PropTypes.instanceOf(Object),
    };

    static defaultProps = {
        className: null,
        children: null,
        forwardRef: null,
    };

    render() {
        const {
            className, children, forwardRef, ...rest
        } = this.props;

        return (
            <Typography
                ref={forwardRef}
                className={classnames('ra-overline', className)}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(Overline);
