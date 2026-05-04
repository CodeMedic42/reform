import React, { forwardRef } from 'react';

type ExtractRefType<P> = P extends { forwardRef?: React.Ref<infer R> | null } ? R : unknown;

function applyForwardRef<
    P extends { forwardRef?: React.Ref<any> | null },
    Result = React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<P, 'forwardRef'>> & React.RefAttributes<ExtractRefType<P>>>,
>(Component: React.ComponentType<P>): Result {
    const ForwardedComponent = forwardRef<ExtractRefType<P>, Omit<P, 'forwardRef'>>((props, ref) => (
        <Component {...props as any} forwardRef={ref} />
    ));

    const name = Component.displayName || Component.name;
    ForwardedComponent.displayName = `${name}_Ref`;

    return ForwardedComponent as unknown as Result;
}

export default applyForwardRef;
