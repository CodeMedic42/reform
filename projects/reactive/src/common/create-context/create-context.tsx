/* eslint-disable react/no-unused-prop-types, react/jsx-props-no-spreading */
import React from 'react';
import wrappedContext from './wrapped-context.js';

interface ContextWithConsumer<T> extends React.Context<T> {
	ApplyConsumer: (Component: React.ComponentType<any>) => React.ComponentType<any>;
}

export default function createContext<T = unknown>(propName?: string): ContextWithConsumer<T> {
	const context = React.createContext<T>(undefined as T) as ContextWithConsumer<T>;

	context.ApplyConsumer = (Component: React.ComponentType<any>) =>
		wrappedContext(context, Component, propName);

	return context;
}
