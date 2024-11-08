import { useCallback, useContext } from 'react';
import isFunction from 'lodash/isFunction';
import systemContext from './girder-react-context';

function useAspect(aspectId) {
    return useContext(systemContext).useAspect(aspectId);
}

function useAction(action) {
    if (!isFunction(action)) {
        throw new Error('useAction must be provided a function.');
    }

    const context = useContext(systemContext);

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
