import React from 'react';
import classNames from 'classnames';
import FormField from './support/form-field.js';
import InputNumericField from '../../fields/numeric-input-field/index.js';

interface FormInputTextFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormInputNumericField(props: FormInputTextFieldProps) {
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
			ControlComponent={InputNumericField}
			className={classNames('re-form-input-numeric-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormInputNumericField;