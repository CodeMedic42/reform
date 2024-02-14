/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';

function applyForwardRef(Component) {
    const ForwardedComponent = forwardRef((props, ref) => (
        <Component {...props} forwardRef={ref} />
    ));

    const name = Component.displayName || Component.name;
    ForwardedComponent.displayName = `${name}_Ref`;

    return ForwardedComponent;
}

export default applyForwardRef;
