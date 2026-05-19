import React from 'react';
import classNames from 'classnames';
import FormField from './_support/form-field.js';
import DateRangeSelectField from '../../fields/date-range-select-field/index.js';

import type { DateRangeSelectFieldProps } from '../../fields/date-range-select-field/index.js';

interface FormDateRangeSelectFieldProps extends Omit<DateRangeSelectFieldProps, 'value'> {
      path: string;
      validation?: any;
      validateOnBlur?: boolean;
} 

function FormDateRangeSelectField(props: FormDateRangeSelectFieldProps) {
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
			ControlComponent={DateRangeSelectField}
			className={classNames('re-form-date-range-select-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={[]}
		/>
	);
}

export default FormDateRangeSelectField;