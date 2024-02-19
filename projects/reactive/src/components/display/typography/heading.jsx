/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import Typography from './typography';
import applyForwardRef from '../../../common/apply-forward-ref';

class Heading extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        level: PropTypes.oneOf(['1', '2', '3', '4', '5']).isRequired,
        forwardRef: PropTypes.instanceOf(Object),
        responsive: PropTypes.bool,
    };

    static defaultProps = {
        className: null,
        children: null,
        forwardRef: null,
        responsive: false,
    };

    render() {
        const {
            level, className, children, forwardRef, responsive, ...rest
        } = this.props;

        if (isNil(level)) {
            throw new Error('Heading requires a valid level to be specified.');
        }

        return (
            <Typography
                ref={forwardRef}
                Component={`h${level}`}
                className={classnames(
                    'ra-heading',
                    className,
                    `level-${level}`,
                    responsive,
                )}
                role="heading"
                aria-level={level}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(Heading);
