import React from 'react';
import classNames from 'classnames';
import FormField from './support/form-field.js';
import TextAreaField from '../../fields/textarea-input-field/index.js';

interface FormInputTextFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormTextAreaField(props: FormInputTextFieldProps) {
	const {
		path,
		className,
		validateOnBlur,
		...rest
	} = props;

	return (
		<FormField
			{...rest}
			path={path}
			ControlComponent={TextAreaField}
			className={classNames('re-form-text-area-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormTextAreaField;