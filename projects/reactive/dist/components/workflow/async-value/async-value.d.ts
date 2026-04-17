import React from "react";
type Value<T> = Promise<T> | (() => Promise<T>);
interface AsyncValueProps<T> {
    value: Value<T>;
    LoadingComponent: React.FC;
    LoadedComponent: React.FC<{
        value: any;
    }>;
}
declare function AsyncValue<T>(props: AsyncValueProps<T>): React.JSX.Element;
export default AsyncValue;
//# sourceMappingURL=async-value.d.ts.map