declare module 'fluxible-addons-react' {
    import type { ComponentType, ReactNode } from 'react';

    interface FluxibleContext {
        getStore<T>(store: unknown): T;
        executeAction(action: unknown, payload?: unknown): Promise<void>;
    }

    /**
     * Higher-order component that provides Fluxible context to the wrapped component.
     * Adds a `context` prop that accepts a FluxibleContext instance.
     */
    export function provideContext<P extends { children?: ReactNode }>(
        Component: ComponentType<P>
    ): ComponentType<P & { context?: FluxibleContext }>;

    /**
     * Higher-order component that connects a component to Fluxible stores.
     */
    export function connectToStores<P>(
        Component: ComponentType<P>,
        stores: unknown[],
        getStateFromStores: (context: FluxibleContext, props: P) => Partial<P>
    ): ComponentType<Omit<P, keyof ReturnType<typeof getStateFromStores>>>;
}
