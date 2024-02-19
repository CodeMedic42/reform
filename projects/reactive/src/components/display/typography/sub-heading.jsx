/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Typography from './typography';
import applyForwardRef from '../../../common/apply-forward-ref';

class SubHeading extends PureComponent {
    static propTypes = {
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

    static defaultProps = {
        className: null,
        children: null,
        forwardRef: null,
        weightNormal: false,
        responsive: false,
    };

    render() {
        const {
            className,
            children,
            level,
            weightNormal,
            forwardRef,
            responsive,
            ...rest
        } = this.props;

        return (
            <Typography
                ref={forwardRef}
                Component="div"
                className={classnames(
                    'ra-sub-heading',
                    className,
                    `level-${level}`,
                    {
                        'weight-normal': weightNormal,
                        responsive,
                    },
                )}
                {...rest}
            >
                {children}
            </Typography>
        );
    }
}

export default applyForwardRef(SubHeading);
