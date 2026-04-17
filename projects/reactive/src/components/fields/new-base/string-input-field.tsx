/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

interface StringInputProps {
	className?: string | null;
	onChange: (value: string | null) => void;
	value?: string | null;
	Component: React.ElementType;
	[key: string]: unknown;
}

const StringInput = forwardRef<unknown, StringInputProps>((props, ref) => {
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
			className={classnames('ra-input-field', 'ra-text-field', className)}
			value={!isNil(value) ? value : ''}
			onChange={handleChange}
		/>
	);
});

StringInput.displayName = 'StringInput';

export default StringInput;
