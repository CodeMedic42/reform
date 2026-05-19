import React from 'react';
import { Data, Property } from '@reformjs/reactive-data';
import { useRefCallback } from '@reformjs/reactive-hooks';
import { isNil } from 'lodash-es';

export interface FormConfig {
	validateOnBlur: boolean,
}

export interface FormMeta {
	ancestorProperty: Property;
	data: Data;
	config: FormConfig;
}

const formContext = React.createContext<FormMeta | null>(null);

interface Base {
	[key: string]: any
}

export interface PropertyConsumerComponentProps extends Base {
	property: Property,
	data: Data,
	validateOnBlur: boolean,
}

interface PropertyConsumerProps extends Base {
	path?: string,
}

export function ApplyFormPropertyConsumer<T>(Component: React.ComponentType<T & PropertyConsumerComponentProps>) {
	return function PropertyConsumer(props: PropertyConsumerProps & T) {
		return (
			<formContext.Consumer>
				{(formMeta) => {
					if (isNil(formMeta)) {
						throw new Error('Form meta is nil');
					}

					const {
						data,
						ancestorProperty,
					} = formMeta;

					const { path, ...rest } = props;

					const property = ancestorProperty.getPropertyAt(!isNil(path) ? path : '');

						return React.createElement(Component, {
						key: path,
						property,
						data,
						validateOnBlur: formMeta.config.validateOnBlur,
						...(rest as T),
					});
				}}
			</formContext.Consumer>
		);
	};
}

export interface FormContextProviderProps extends FormMeta {
	children: React.ReactNode;
}

export function FormContextProvider(props: FormContextProviderProps) {
	const {
		children,
		ancestorProperty,
		data,
		config,
	} = props;

	const contextRef = useRefCallback(() => ({
		ancestorProperty,
		data,
		config,
	}));

	return <formContext.Provider value={contextRef.current}>{children}</formContext.Provider>;
}
