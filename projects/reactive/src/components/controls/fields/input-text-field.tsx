import React from 'react';
import classNames from "classnames";
import { isNil } from "lodash-es";
import { useCallback } from "react";
import Field from './support/field.js';

interface InputTextFieldProps {
	className?: string,
	value: string,
	onChange?: (value: string | null) => void,
	messages?: string[],
	attributes?: { [key: string]: any }
}

function InputTextField(props: InputTextFieldProps) {
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
				target: { value: changedValue },
			} = event;

			onChange(changedValue !== '' ? changedValue : null);
		}, 
		[],
	);

	return (
		<Field
			className={classNames('re-input-text-field', className)}
			messages={messages}
		>
			<div>
				<span>
					<input
						{...rest}
						value={!isNil(value) ? value : ''}
						onChange={handleChange}
						{...attributes}
					/>
				</span>
			</div>
		</Field>
	);	
}

export default InputTextField;