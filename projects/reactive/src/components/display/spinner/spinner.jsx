import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { paletteColorOrder } from '../../../common/color-list';

function Spinner(props) {
    const {
        id, className, size, color,
    } = props;

    const sizeClass = !isNil(size) ? `size-${size}` : 'size-md';

    return (
        <span
            id={id}
            className={classnames(
                'ra-spinner',
                `color-${color === null ? 'blue' : color}`,
                sizeClass,
                className,
            )}
        />
    );
}

Spinner.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    color: PropTypes.oneOf(paletteColorOrder),
};

Spinner.defaultProps = {
    id: null,
    className: null,
    size: 'md',
    color: 'blue',
};

export default Spinner;
