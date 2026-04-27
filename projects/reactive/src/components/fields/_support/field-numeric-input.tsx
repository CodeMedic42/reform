import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import { isNil, isNaN, toString } from 'lodash-es';

interface FieldNumericInputProps {
	className?: string | null;
	onChange: (value: number | null) => void;
	value?: string | null;
	Component: React.ElementType;
	id?: string | null;
	type?: string;
	size?: string;
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

const FieldNumericInput = forwardRef<unknown, FieldNumericInputProps>((props, ref) => {
	const {
		className = null,
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
			className={classnames('ra-field-input', 'ra-field-numeric-input', className)}
			value={getNumericValue(value)}
			onChange={handleChange}
			{...rest}
		/>
	);
});

FieldNumericInput.displayName = 'FieldNumericInput';

export default FieldNumericInput;
