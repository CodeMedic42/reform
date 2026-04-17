import { useState } from 'react';

function usePromise(promise, initialValue = undefined) {
    const [status, setStatus] = useState({
        result: initialValue,
        error: null,
    });
    Promise.resolve(promise)
        .then((result) => {
        setStatus({
            result,
            error: null,
        });
    })
        .catch((error) => {
        setStatus({
            ...status,
            error,
        });
    });
}

export { usePromise as default };
