import { createContext } from 'react';

export interface GirderReactContextValue {
    useAspect: (aspectId: string) => unknown;
    useAction: (action: ActionFunction, ...args: unknown[]) => Promise<void>;
}

export type ActionFunction = (girderContext: GirderContext, ...args: unknown[]) => unknown;

export interface GirderContext {
    getAspect: (aspectId: string) => unknown;
}

const girderReactContext = createContext<GirderReactContextValue | undefined>(undefined);

export default girderReactContext;
