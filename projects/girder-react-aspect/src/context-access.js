import { useCallback, useContext } from 'react';
import Promise from 'bluebird';
import noop from 'lodash/noop';
import systemContext from './context';

function useAspect(aspectId) {
    const context = useContext(systemContext);

    return context[aspectId];
}

function useAction(action) {
    const context = useContext(systemContext);

    // The reason for using the
    return useCallback((...args) => Promise
        .try(() => action(context, ...args))
        // Swallow everything, the dev should get data from the store.
        // The only thing they should know is the action finished.
        .then(noop)
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err);
        }),
        [action, context]
    );
}

export {
    useAspect,
    useAction,
};
