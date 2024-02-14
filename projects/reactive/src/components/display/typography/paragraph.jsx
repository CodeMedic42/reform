/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import Typography from './typography';
import applyForwardRef from '../../../common/apply-forward-ref';

function Paragraph(props) {
    const {
        className, size, weight, forwardRef, children, ...rest
    } = props;

    const weightClass = !isNil(weight) ? `weight-${weight}` : null;
    const sizeClass = !isNil(size) ? `size-${size}` : null;

    return (
        <Typography
            ref={forwardRef}
            Component="p"
            className={classnames(
                'ra-paragraph',
                sizeClass,
                className,
                weightClass,
            )}
            {...rest}
        >
            {children}
        </Typography>
    );
}

Paragraph.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    weight: PropTypes.oneOf(['bold', 'semi-bold', 'normal']),
    forwardRef: PropTypes.instanceOf(Object),
};

Paragraph.defaultProps = {
    className: null,
    children: null,
    weight: null,
    forwardRef: null,
    size: null,
};

export default applyForwardRef(memo(Paragraph));
