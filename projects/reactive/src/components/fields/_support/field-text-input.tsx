import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

interface StringInputProps {
	className?: string | null;
	onChange: (value: string | null) => void;
	value?: string | null;
	Component: React.ElementType;
	id?: string | null;
	type?: string;
	size?: string;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	disabled?: boolean;
}

const FieldTextInput = forwardRef<unknown, StringInputProps>((props, ref) => {
	const {
		onChange,
		value = null,
		Component,
		className = null,
		...rest
	} = props;

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value: newValue },
		} = event;

		onChange(newValue.length > 0 ? newValue : null);
	}, [onChange]);

	return (
		<Component
			{...rest}
			ref={ref}
			className={classnames('ra-field-input', 'ra-field-text-input', className)}
			value={!isNil(value) ? value : ''}
			onChange={handleChange}
		/>
	);
});

FieldTextInput.displayName = 'FieldTextInput';

export default FieldTextInput;
