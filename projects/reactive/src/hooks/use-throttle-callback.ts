import { useMemo, useRef } from 'react';
import { isNil, throttle, ThrottleSettings } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useThrottleCallback(cb: (...args: any[]) => any, dep: React.DependencyList, wait?: number, options?: ThrottleSettings) {
    const old = useRef<ReturnType<typeof throttle> | undefined>();

    return useMemo(() => {
        if (!isNil(old.current)) {
            old.current.cancel();
        }

        const t = throttle(cb, wait, options);

        old.current = t;

        return t;
    }, dep);
}

export default useThrottleCallback;
