import { useCallback, useContext } from 'react';
import systemContext from './girder-react-context';

function useAspect(aspectId) {
    return useContext(systemContext).useAspect(aspectId);
}

function useAction(action) {
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
