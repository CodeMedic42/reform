import React, { useCallback, forwardRef } from 'react';
import classnames from 'classnames';
import { isNil, clone, pullAt } from 'lodash-es';
import Select from '../_support/select-field/index.js';
import MultiSelectFieldContainer from './multi-select-field-container.js';

interface MultiSelectFieldProps {
	className?: string | null;
	expandable?: boolean;
	onChange?: ((value: Array<string | number> | null) => void) | null;
	value?: Array<string | number> | null;
	nullable?: boolean;
}

const MultiSelectField = forwardRef<unknown, MultiSelectFieldProps>((props, ref) => {
	const {
		className = null,
		expandable = false,
		onChange = null,
		value = null,
		nullable = false,
		...rest
	} = props;

    const handleClear = useCallback(() => {
        if (onChange) {
            onChange(null);
        }
    }, [ onChange ]);

	const handleClearIndex = useCallback(({ index }: { index: number }) => {
        if (isNil(onChange)) {
            return;
        }

        const newValue = clone(value) as Array<string | number>;

        pullAt(newValue, [index]);

        if (newValue.length <= 0) {
            onChange(null);
            return;
        }

        onChange(newValue);
    }, [value, onChange]);

	return (
		<Select
			enableFiltering
			{...rest}
			ref={ref}
			className={classnames(
				'ra-multi-select-field',
				className,
				{
					expandable,
				},
			)}
			Anchor={MultiSelectFieldContainer}
            anchorProps={{
                onClear: handleClear,
				onClearIndex: handleClearIndex,
				nullable,
            }}
			useFilter
			isMultiSelect
			onSelect={onChange as ((value: unknown) => void) | null}
		/>
	);
});

export default MultiSelectField;
