import React from 'react';
import classNames from 'classnames';
import FormField from './_support/form-field.js';
import NumericField from '../../fields/numeric-field/index.js';

interface FormNumericFieldProps {
	className?: string,
	path: string,
	validation?: any,
	validateOnBlur?: boolean,
}

function FormNumericField(props: FormNumericFieldProps) {
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
			ControlComponent={NumericField}
			className={classNames('re-form-numeric-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={['required']}
		/>
	);
}

export default FormNumericField;