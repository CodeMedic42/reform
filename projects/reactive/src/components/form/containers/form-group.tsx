import React from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import FormAccess, { FormAccessControl } from '../_support/form-access.js';
import { FormContextProvider } from '../_support/form-context.js';

type FormGroupProps<C extends React.ElementType> = {
	InnerComponent?: C;
	path: string;
	className?: string;
	children: React.ReactNode;
	validateOnBlur?: boolean
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'>;

function FormGroup<C extends React.ElementType = 'fieldset'>({
	InnerComponent,
	path,
	className,
	children,
	validateOnBlur,
	...rest
}: FormGroupProps<C>) {
  const Component = InnerComponent || ('fieldset' as React.ElementType);

  return (
	<FormAccess path={path} listenToProperty>
		{(accessControl: FormAccessControl<any>) => {
			const {
				property,
				validateOnBlur: rootValidateOnBlur,
			} = accessControl;

			return React.createElement(
				Component,
				{
					className: classnames('re-form-group', className),
					...rest,
				},
				(
					<FormContextProvider
						ancestorProperty={property}
						data={property.getData()}
						config={{
							validateOnBlur: isNil(validateOnBlur) ? rootValidateOnBlur : validateOnBlur,
						}}
					>
						{children}
					</FormContextProvider>
				)
			)
		}}
		</FormAccess>
	);
}

export default FormGroup;