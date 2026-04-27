import React from 'react';
import classNames from 'classnames';
import FormField from './_support/form-field.js';
import TextField from '../../fields/text-field/index.js';

interface FormTextFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormTextField(props: FormTextFieldProps) {
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
			ControlComponent={TextField}
			className={classNames('re-form-text-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormTextField;