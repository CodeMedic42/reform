/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import Select from '../base-components/select/index.js';
import SelectAnchor from './select-field-anchor.js';

interface SelectInputProps {
    className?: string | null;
    onChange?: ((value: string | number | null) => void) | null;
    nullable?: boolean;
    value?: string | number | null;
    [key: string]: unknown;
}

const SelectInput = forwardRef<unknown, SelectInputProps>((props, ref) => {
    const {
        className = null,
        onChange = null,
        nullable = false,
        ...rest
    } = props;

    const handleClear = useCallback(() => {
        if (onChange) {
            onChange(null);
        }
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

export default SelectInput;
