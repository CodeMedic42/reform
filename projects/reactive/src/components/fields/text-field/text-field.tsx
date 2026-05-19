import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import Field from '../_support/field.js';
import type { FieldMessageData } from '../_support/field-messages.js';
import TextFieldContainer from './text-field-container.js';

export interface TextFieldProps {
	id?: string | null;
	className?: string | null;
	label?: string | null;
	disabled?: boolean;
	variant?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	hidden?: boolean;
	failure?: boolean;
	messages?: FieldMessageData | null;
}

const TextField = forwardRef<unknown, TextFieldProps>((props, ref) => {
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
		<Field
			className={classnames('ra-text-field', className)}
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
				<TextFieldContainer
					{...rest}
					type="text"
					id={inputId}
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					disabled={disabled}
				/>
			)}
		</Field>
	);
});

export default TextField;
