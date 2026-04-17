import React from 'react';
import classNames from 'classnames';
import FormField from './support/form-field.js';
import InputTextField from '../../fields/text-input-field/index.js';

interface FormInputTextFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormInputTextField(props: FormInputTextFieldProps) {
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
			ControlComponent={InputTextField}
			className={classNames('re-form-input-text-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormInputTextField;