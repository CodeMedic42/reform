import React, { forwardRef } from 'react';

function applyForwardRef<P extends { forwardRef?: React.Ref<any> | null }>(Component: React.ComponentType<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<P, 'forwardRef'>> & React.RefAttributes<unknown>> {
    const ForwardedComponent = forwardRef<unknown, Omit<P, 'forwardRef'>>((props, ref) => (
        <Component {...props as any} forwardRef={ref} />
    ));

    const name = Component.displayName || Component.name;
    ForwardedComponent.displayName = `${name}_Ref`;

    return ForwardedComponent;
}

export default applyForwardRef;
