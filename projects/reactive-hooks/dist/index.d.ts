import React from 'react';

declare function useRefCallback<T>(cb: () => T): React.MutableRefObject<T>;

declare function useInterval(cb: () => any, mill: number, initialValue?: undefined): undefined;

declare function usePromise<T>(promise: Promise<T | undefined>, initialValue?: T | undefined): void;

export { useInterval, usePromise, useRefCallback };
