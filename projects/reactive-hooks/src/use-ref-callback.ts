import React, { useRef } from 'react';
import { isNil } from "lodash-es";

export default function useRefCallback<T>(cb: () => T): React.MutableRefObject<T> {
	const ref: React.MutableRefObject<T | null> = useRef<T | null>(null);

	if (isNil(ref.current)) {
		ref.current = cb();
	}

	// At this point, ref.current is guaranteed to be T
	return ref as React.MutableRefObject<T>;
}