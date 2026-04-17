import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import InputLabel from '../new-base/input-field-label.js';
import TextareaInputFieldBase from './textarea-input-field-base.js';

interface InputMessagesData {
	general?: string[];
	success?: string[];
	failure?: string[];
}

interface TextareaInputFieldProps {
	id?: string | null;
	className?: string | null;
	label?: string | null;
	disabled?: boolean;
	variant?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	hidden?: boolean;
	failure?: boolean;
	messages?: InputMessagesData | null;
	[key: string]: unknown;
}

const TextareaInputField = forwardRef<unknown, TextareaInputFieldProps>((props, ref) => {
	const {
		className = null,
		id = null,
		label = null,
		messages = null,
		failure = false,
		'aria-labelledby': ariaLabelledby = null,
		'aria-describedby': ariaDescribedby = null,
		hidden = false,
		disabled = false,
		variant = null,
		...rest
	} = props;

	const inputRef = useRef<any>();

	useImperativeHandle(ref, () => ({
        getInputRef: () => inputRef,
		focus: () => {
			if (disabled) {
				return;
			}

			inputRef.current.focus();
		},
    }), [disabled]);

	return (
		<InputLabel
			className={classnames('ra-text-input', className)}
			id={id}
			label={label}
			messages={messages}
			failure={failure}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}
			hidden={hidden}
			disabled={disabled}
			variant={variant}
		>
			{({ describedBy, labelledBy, inputId }: { describedBy: string | null; labelledBy: string; inputId: string }) => (
				<TextareaInputFieldBase
					{...rest}
					type="text"
					id={inputId}
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					disabled={disabled}
				/>
			)}
		</InputLabel>
	);
});

export default TextareaInputField;
