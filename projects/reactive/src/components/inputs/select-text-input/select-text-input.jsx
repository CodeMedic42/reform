/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Select, {
    propTypes as selectPropTypes,
    defaultProps as selectDefaultProps,
} from '../base-components/select/index';
import SelectTextAnchor from './select-text-anchor';

const SelectTextInput = forwardRef((props, ref) => {
    const {
        className,
        onChange,
        ...rest
    } = props;

    return (
        <Select
            {...rest}
            ref={ref}
            className={classnames('ra-select-text-input', className)}
            Anchor={SelectTextAnchor}
            anchorProps={{
                onChange,
            }}
        />
    );
});

SelectTextInput.propTypes = {
    ...selectPropTypes,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

SelectTextInput.defaultProps = {
    ...selectDefaultProps,
    value: null,
    onChange: null,
};

export default SelectTextInput;
