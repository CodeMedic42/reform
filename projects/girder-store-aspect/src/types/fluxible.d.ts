declare module 'fluxible' {
    interface FluxibleOptions {
        stores?: unknown[];
    }

    interface FluxibleContext {
        getStore<T>(store: unknown): T;
        executeAction(action: unknown, payload?: unknown): Promise<void>;
    }

    class Fluxible {
        constructor(options?: FluxibleOptions);
        createContext(): FluxibleContext;
        registerStore(store: unknown): void;
    }

    export default Fluxible;
}
