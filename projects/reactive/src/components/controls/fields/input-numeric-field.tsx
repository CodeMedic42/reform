import React from 'react';
import classNames from "classnames";
import { isNil } from "lodash-es";
import { useCallback } from "react";
import Field from './support/field.js';

interface InputNumericFieldProps {
	className?: string,
	value: string,
	onChange?: (value: number | null) => void,
	messages?: string[],
	attributes?: { [key: string]: any }
}

function InputNumericField(props: InputNumericFieldProps) {
	const {
		className,
		value,
		onChange,
		messages,
		attributes,
		...rest
	} = props;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (isNil(onChange)) {
				return;
			}

			let {
				target: {
					value: changedValue,
					valueAsNumber,
					validity,
				},
			} = event;

			onChange(validity.badInput || changedValue.length > 0 ? valueAsNumber : null);
		}, 
		[],
	);

	return (
		<Field
			className={classNames('re-input-numeric-field', className)}
			messages={messages}
		>
			<div>
				<span>
					<input
						{...rest}
						value={!isNil(value) ? value : ''}
						onChange={handleChange}
						{...attributes}
						type='number'
					/>
				</span>
			</div>
		</Field>
	);
}

export default InputNumericField;