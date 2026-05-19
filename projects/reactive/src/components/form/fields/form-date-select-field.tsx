import React from 'react';
import classNames from 'classnames';
import FormField from './_support/form-field.js';
import DateSingleSelectField from '../../fields/date-single-select-field/index.js';

import type { DateSingleSelectFieldProps } from '../../fields/date-single-select-field/index.js';                             
                                                                                                                                                
interface FormDateSingleSelectFieldProps extends Omit<DateSingleSelectFieldProps, 'value'> {                                                    
      path: string;                                                                                                                             
      validation?: any;                                                                                                                         
      validateOnBlur?: boolean;                                                                                                                 
} 

function FormDateSingleSelectField(props: FormDateSingleSelectFieldProps) {
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
			ControlComponent={DateSingleSelectField}
			className={classNames('re-form-date-single-select-field', className)}
			validateOnBlur={validateOnBlur}
			nativeAttributes={[]}
		/>
	);
}

export default FormDateSingleSelectField;