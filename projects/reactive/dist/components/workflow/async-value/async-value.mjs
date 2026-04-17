import React, { useState, useEffect } from 'react';
import { isNil, isFunction } from 'lodash-es';

function useAsyncState(promise) {
    const [loadedValue, setValue] = useState(undefined);
    useEffect(() => {
        const cb = !isFunction(promise)
            ? () => promise
            : promise;
        Promise.resolve(cb())
            .then((value) => {
            setValue(value);
        });
    }, []);
    return loadedValue;
}
function AsyncValue(props) {
    const { value, LoadingComponent, LoadedComponent } = props;
    const loadedValue = useAsyncState(value);
    if (isNil(loadedValue)) {
        return (React.createElement(LoadingComponent, null));
    }
    return React.createElement(LoadedComponent, { value: loadedValue });
}

export { AsyncValue as default };
