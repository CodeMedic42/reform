import React, { useCallback } from 'react';
import classNames from "classnames";
import { isNil } from "lodash-es";
import Field from './support/field.js';

interface InputTextFieldProps {
	className?: string,
	value: string,
	onChange?: (value: string | null) => void,
	messages?: string[],
	attributes?: { [key: string]: any }
}

function InputTextAreaField(props: InputTextFieldProps) {
	const {
		className,
		value,
		onChange,
		messages,
		attributes,
		...rest
	} = props;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (isNil(onChange)) {
				return;
			}

			const {
				target: { value: changedValue },
			} = event;

			onChange(changedValue !== '' ? changedValue : null);
		}, 
		[],
	);

	return (
		<Field
			className={classNames('re-text-area-field', className)}
			messages={messages}
		>
			<div>
				<span>
					<textarea
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

export default InputTextAreaField;