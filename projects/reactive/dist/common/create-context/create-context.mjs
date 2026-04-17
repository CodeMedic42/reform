import React from 'react';
import wrappedContext from './wrapped-context.mjs';

/* eslint-disable react/no-unused-prop-types, react/jsx-props-no-spreading */
function createContext(propName) {
    const context = React.createContext();
    context.ApplyConsumer = (Component) => wrappedContext(context, Component, propName);
    return context;
}

export { createContext as default };
