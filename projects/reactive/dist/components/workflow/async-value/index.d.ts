import React__default from 'react';

type Value<T> = Promise<T> | (() => Promise<T>);
interface AsyncValueProps<T> {
    value: Value<T>;
    LoadingComponent: React__default.FC;
    LoadedComponent: React__default.FC<{
        value: any;
    }>;
}
declare function AsyncValue<T>(props: AsyncValueProps<T>): React__default.JSX.Element;

export { AsyncValue as default };
