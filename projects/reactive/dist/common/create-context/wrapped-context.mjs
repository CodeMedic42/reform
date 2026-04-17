import { isNil } from 'lodash-es';
import React from 'react';

/* eslint-disable react/jsx-props-no-spreading */
var wrappedContext = (Context, Component, contextName) => {
    const propName = !isNil(contextName) && contextName.length > 0 ? contextName : 'context';
    const wrapped = React.forwardRef((props, ref) => {
        // eslint-disable-next-line react/prop-types
        const { children, ...rest } = props;
        return (React.createElement(Context.Consumer, null, (contextValue) => {
            const contextProp = {
                [propName]: contextValue,
            };
            return (React.createElement(Component, { ref: ref, ...rest, ...contextProp }, children));
        }));
    });
    wrapped.displayName = Component.name;
    // eslint-disable-next-line no-param-reassign
    Component.displayName = `Wrapped${Component.name}`;
    return wrapped;
};

export { wrappedContext as default };
