import { useRef, useMemo } from 'react';
import { isNil, throttle } from 'lodash-es';

function useThrottleCallback(cb, dep, wait, options) {
    const old = useRef();
    return useMemo(() => {
        if (!isNil(old.current)) {
            old.current.cancel();
        }
        const t = throttle(cb, wait, options);
        old.current = t;
        return t;
    }, dep);
}

export { useThrottleCallback as default };
