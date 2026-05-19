import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import SelectField from '../_support/select-field/index.js';
import SingleSelectFieldContainer from './single-select-field-container.js';

export interface SingleSelectFieldProps<
    TValue extends string | number = string | number,
    TOption = unknown,
> {
    id?: string | null;
    className?: string | null;
    onChange?: ((value: TValue | null) => void) | null;
    nullable?: boolean;
    value?: TValue | null;
    options?: TOption[] | null;
    size?: string;
    optionValuePath?: string | ((option: TOption) => TValue) | null;
    optionLabelPath?: string | ((option: TOption) => string | number) | null;
}

function SingleSelectFieldInner<
    TValue extends string | number = string | number,
    TOption = unknown,
>(
    props: SingleSelectFieldProps<TValue, TOption>,
    ref: React.ForwardedRef<unknown>,
) {
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
        <SelectField
            enableFiltering
            {...(rest as Record<string, unknown>)}
            ref={ref}
            className={classnames('ra-single-select-field', className)}
            anchorProps={{
                onClear: handleClear,
                nullable,
            }}
            Anchor={SingleSelectFieldContainer}
            onSelect={onChange as ((value: unknown) => void) | null}
        />
    );
}

const SingleSelectField = forwardRef(SingleSelectFieldInner) as <
    TValue extends string | number = string | number,
    TOption = unknown,
>(
    props: SingleSelectFieldProps<TValue, TOption> & React.RefAttributes<unknown>
) => React.ReactElement | null;

export default SingleSelectField;
