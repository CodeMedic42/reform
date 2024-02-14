/* eslint-disable react/jsx-props-no-spreading */
import isNil from 'lodash/isNil';
import React from 'react';

export default (Context, Component, contextName) => {
	const propName =
		!isNil(contextName) && contextName.length > 0 ? contextName : 'context';

	const wrapped = React.forwardRef((props, ref) => {
		// eslint-disable-next-line react/prop-types
		const { children, ...rest } = props;

		return (
			<Context.Consumer>
				{(contextValue) => {
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
