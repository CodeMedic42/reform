import { useCallback, useContext } from 'react';
import { isFunction } from 'lodash-es';
import reactContext from './girder-react-context.js';
import type { ActionFunction } from './girder-react-context.js';

function useAspect(aspectId: string): unknown {
    const context = useContext(reactContext);

    if (!context) {
        throw new Error('useAspect must be used within a GirderReactContext provider.');
    }

    return context.useAspect(aspectId);
}

function useAction(action: ActionFunction): (...args: unknown[]) => Promise<void> {
    if (!isFunction(action)) {
        throw new Error('useAction must be provided a function.');
    }

    const context = useContext(reactContext);

    if (!context) {
        throw new Error('useAction must be used within a GirderReactContext provider.');
    }

    // The reason for using the
    return useCallback(
        (...args: unknown[]) => context.useAction(action, ...args),
        [action, context]
    );
}

export {
    useAspect,
    useAction,
};
