import { useCallback, useContext } from 'react';
import isFunction from 'lodash/isFunction';
import reactContext from './girder-react-context';

function useAspect(aspectId) {
    return useContext(reactContext).useAspect(aspectId);
}

function useAction(action) {
    if (!isFunction(action)) {
        throw new Error('useAction must be provided a function.');
    }

    const context = useContext(reactContext);

    // The reason for using the
    return useCallback(
        (...args) => context.useAction(action, ...args),
        [action, context]
    );
}

export {
    useAspect,
    useAction,
};
