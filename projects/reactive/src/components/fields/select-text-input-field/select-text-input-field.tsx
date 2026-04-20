import React, { forwardRef } from 'react';
import classnames from 'classnames';
import Select from '../base-components/select/index.js';
import SelectTextAnchor from './select-text-inout-field-anchor.js';

interface SelectTextInputProps {
    className?: string | null;
    onChange?: ((value: unknown) => void) | null;
    value?: string | number | null;
}

const SelectTextInput = forwardRef<unknown, SelectTextInputProps>((props, ref) => {
    const {
        className = null,
        onChange = null,
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

export default SelectTextInput;
