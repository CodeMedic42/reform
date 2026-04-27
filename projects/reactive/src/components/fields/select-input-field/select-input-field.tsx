import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import Select from '../_support/select/index.js';
import SelectAnchor from './select-field-anchor.js';

interface SelectInputProps {
    id?: string | null;
    className?: string | null;
    onChange?: ((value: string | number | null) => void) | null;
    nullable?: boolean;
    value?: string | number | null;
    options?: unknown[] | null;
    size?: string;
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
            onSelect={onChange as ((value: unknown) => void) | null}
        />
    );
});

export default SelectInput;
