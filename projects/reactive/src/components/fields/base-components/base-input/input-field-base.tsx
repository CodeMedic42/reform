/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useCallback } from 'react';
import { isNil, toString } from 'lodash-es';

interface InputBaseProps {
	onChange: (value: string | null) => void;
	value?: string | null;
	forwardedRef?: React.Ref<unknown> | null;
	Component: React.ElementType;
	[key: string]: unknown;
}

const InputBase = forwardRef<unknown, InputBaseProps>((props, ref) => {
	const {
		onChange,
		value,
		forwardedRef,
		Component,
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
			ref={ref}
			value={!isNil(value) ? toString(value) : ''}
			onChange={handleChange}
			{...rest}
		/>
	);
});

InputBase.displayName = 'InputBase';

export default InputBase;
