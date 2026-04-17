import React, { useCallback, forwardRef } from 'react';
import classnames from 'classnames';
import { isNil, clone, pullAt } from 'lodash-es';
import Select from '../base-components/select/index.js';
import MultiSelectAnchor from './multi-select-input-field-anchor.js';

interface MultiSelectInputProps {
	className?: string | null;
	expandable?: boolean;
	onChange?: ((value: Array<string | number> | null) => void) | null;
	value?: Array<string | number> | null;
	nullable?: boolean;
	[key: string]: unknown;
}

const MultiSelectInput = forwardRef<unknown, MultiSelectInputProps>((props, ref) => {
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

        let newValue = clone(value) as Array<string | number>;

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
				'ra-select-input',
				'ra-multi-select',
				className,
				{
					expandable,
				},
			)}
			Anchor={MultiSelectAnchor}
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

export default MultiSelectInput;
