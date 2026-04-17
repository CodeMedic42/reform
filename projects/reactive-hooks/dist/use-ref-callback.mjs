import { isNil } from 'lodash-es';
import { useRef } from 'react';

function useRefCallback(cb) {
    const ref = useRef(null);
    if (isNil(ref.current)) {
        ref.current = cb();
    }
    // At this point, ref.current is guaranteed to be T
    return ref;
}

export { useRefCallback as default };
