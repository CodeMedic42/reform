import React from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { Property } from '@reformjs/reactive-data';
import FormAccess, { FormAccessControl } from '../_support/form-access.js';
import { FormContextProvider } from '../_support/form-context.js';

type FormListProps<C extends React.ElementType> = {
	InnerComponent?: C;
	EmptyComponent?: React.ElementType,
	InnerItemComponent?: React.ElementType,
	path: string;
	className?: string;
	children: React.ReactNode;
	validateOnBlur?: boolean;
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'>;

function FormList<C extends React.ElementType = 'fieldset'>({
	path,
	className,
	children,
	InnerComponent,
	EmptyComponent,
	InnerItemComponent,
	validateOnBlur = false,
	...rest
}: FormListProps<C>) {
  const Component = InnerComponent || ('fieldset' as React.ElementType);
  const ItemComponent = InnerItemComponent || ('fieldset' as React.ElementType);

  return (
	<FormAccess path={path} listenToProperty>
		{(accessControl: FormAccessControl<any>) => {
			const {
				property,
				validateOnBlur: rootValidateOnBlur,
			} = accessControl;

			const buildItem = (itemProperty: Property) => (
					<FormContextProvider
						key={itemProperty.getUuid()}
						ancestorProperty={itemProperty}
						data={itemProperty.getData()}
						config={{
							validateOnBlur: isNil(validateOnBlur)? rootValidateOnBlur : validateOnBlur,
						}}
					>
						{
							React.createElement(
								ItemComponent,
								{
									className: classnames('re-form-list-item', className),
									...rest,
								},
								React.Children.map(children, (child) =>
									React.isValidElement(child) ? React.cloneElement(child) : child,
								)
							)
						}
					</FormContextProvider>
				);

			let content: JSX.Element | JSX.Element[] = property.map(buildItem)
			
			if (content.length <= 0 && !isNil(EmptyComponent)) {
				content = React.createElement(EmptyComponent);
			}

			return React.createElement(
				Component,
				{
					className: classnames('re-form-list', className),
					...rest,
				},
				content
			)
		}}
		</FormAccess>
	);
}

export default FormList;