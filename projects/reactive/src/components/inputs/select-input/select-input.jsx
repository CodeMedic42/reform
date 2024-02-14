/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Select, { propTypes as selectPropTypes } from '../base-components/select/index';
import SelectAnchor from './select-anchor';

const SelectInput = forwardRef((props, ref) => {
    const {
        className,
        onChange,
        nullable,
        ...rest
    } = props;

    const handleClear = useCallback(() => {
        onChange(null);
    }, [ onChange ]);

    return (
        <Select
            enableFiltering
            {...rest}
			ref={ref}
            className={classnames('ra-select-input', className)}
            anchorProps={{
                onClear: handleClear,
                nullable,
            }}
            Anchor={SelectAnchor}
            onSelect={onChange}
        />
    );
});

SelectInput.propTypes = {
    ...selectPropTypes,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    nullable: PropTypes.bool,
};

SelectInput.defaultProps = {
    value: null,
    onChange: null,
    nullable: false,
};

export default SelectInput;
