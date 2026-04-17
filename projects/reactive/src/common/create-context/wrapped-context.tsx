/* eslint-disable react/jsx-props-no-spreading */
import { isNil } from 'lodash-es';
import React from 'react';

export default (Context: React.Context<any>, Component: React.ComponentType<any>, contextName?: string) => {
	const propName =
		!isNil(contextName) && contextName.length > 0 ? contextName : 'context';

	const wrapped = React.forwardRef((props: any, ref) => {
		const { children, ...rest } = props;

		return (
			<Context.Consumer>
				{(contextValue: any) => {
					const contextProp = {
						[propName]: contextValue,
					};

					return (
						<Component ref={ref} {...rest} {...contextProp}>
							{children}
						</Component>
					);
				}}
			</Context.Consumer>
		);
	});

	wrapped.displayName = Component.name;

	// eslint-disable-next-line no-param-reassign
	Component.displayName = `Wrapped${Component.name}`;

	return wrapped;
};
