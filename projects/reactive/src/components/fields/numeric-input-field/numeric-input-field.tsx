import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import InputLabel from '../new-base/input-field-label.js';
import NumericInputFieldBase from './numeric-input-field-base.js';

interface InputMessagesData {
	general?: string[];
	success?: string[];
	failure?: string[];
}

interface NumericInputFieldProps {
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
}

const NumericInputField = forwardRef<unknown, NumericInputFieldProps>((props, ref) => {
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
			className={classnames('ra-numeric-input', className)}
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
				<NumericInputFieldBase
					{...rest}
					type="number"
					id={inputId}
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					disabled={disabled}
				/>
			)}
		</InputLabel>
	);
});

export default NumericInputField;
