import React, { forwardRef, useCallback } from 'react';
import { isNil, isNaN, toString } from 'lodash-es';

interface NumericInputProps {
	onChange: (value: number | null) => void;
	value?: string | null;
	Component: React.ElementType;
	id?: string | null;
	type?: string;
	size?: string;
	className?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	disabled?: boolean;
}

function getNumericValue(value: string | null | undefined): string {
	if (isNil(value)) {
		return '';
	}

	if (isNaN(value)) {
		return '';
	}

	return toString(value);
}

const NumericInput = forwardRef<unknown, NumericInputProps>((props, ref) => {
	const {
		onChange,
		value = null,
		Component,
		...rest
	} = props;

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value: newValue, valueAsNumber, validity },
		} = event;

		onChange(validity.badInput || newValue.length > 0 ? valueAsNumber : null);
	}, [onChange]);

	return (
		<Component
			ref={ref}
			value={getNumericValue(value)}
			onChange={handleChange}
			{...rest}
		/>
	);
});

NumericInput.displayName = 'StringInput';

export default NumericInput;
