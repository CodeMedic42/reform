/* eslint-disable react/no-unused-prop-types, react/jsx-props-no-spreading */
import React from 'react';
import wrappedContext from './wrapped-context';

export default function createContext(propName) {
	const context = React.createContext();

	context.ApplyConsumer = (Component) =>
		wrappedContext(context, Component, propName);

	return context;
}
