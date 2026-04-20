import { useMemo, useRef } from 'react';
import { isNil, throttle, ThrottleSettings } from 'lodash-es';

function useThrottleCallback(cb: (...args: any[]) => any, dep: React.DependencyList, wait?: number, options?: ThrottleSettings): ((...args: any[]) => any) {
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
