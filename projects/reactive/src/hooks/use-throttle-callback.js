import { useMemo, useRef } from 'react';
import isNil from 'lodash/isNil';
import throttle from 'lodash/throttle';

function useThrottleCallback(cb, dep, wait, options) {
    const old = useRef();

    return useMemo(() => {
        if (!isNil(old.current)) {
            old.current.cancel();
        }

        const t = throttle(cb, wait, options);

        old.current = t;

        return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dep);
}

export default useThrottleCallback;