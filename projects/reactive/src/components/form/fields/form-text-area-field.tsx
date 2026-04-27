import React from 'react';
import classNames from 'classnames';
import FormField from './_support/form-field.js';
import TextareaField from '../../fields/textarea-field/index.js';

interface FormTextareaFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormTextareaField(props: FormTextareaFieldProps) {
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
			ControlComponent={TextareaField}
			className={classNames('re-form-text-area-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormTextareaField;