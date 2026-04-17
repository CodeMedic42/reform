import React, { forwardRef } from 'react';

/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
function applyForwardRef(Component) {
    const ForwardedComponent = forwardRef((props, ref) => (React.createElement(Component, { ...props, forwardRef: ref })));
    const name = Component.displayName || Component.name;
    ForwardedComponent.displayName = `${name}_Ref`;
    return ForwardedComponent;
}

export { applyForwardRef as default };
