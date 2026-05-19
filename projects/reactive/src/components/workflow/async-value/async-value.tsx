import React, { useEffect, useState } from "react";
import { isFunction, isNil } from "lodash-es";

type Value<T> = Promise<T> | (() => Promise<T>);

interface AsyncValueProps<T> {
	value: Value<T>;
	LoadingComponent: React.FC;
	LoadedComponent: React.FC<{ value: any }>
};

function useAsyncState<T>(promise: Value<T>): T  | undefined{
	const [loadedValue, setValue] = useState<T | undefined>(undefined);

	useEffect(() => {
		const cb = !isFunction(promise)
			? () => promise
			: promise;
		
		Promise.resolve(cb())
			.then((value: T) => {
				setValue(value);
			});	
	}, []);

	return loadedValue;
}

function AsyncValue<T>(props: AsyncValueProps<T>) {
	const {
		value,
		LoadingComponent,
		LoadedComponent
	} = props;
	
	const loadedValue = useAsyncState(value);

	if (isNil(loadedValue)) {
		return (
			<LoadingComponent />
		);
	}

	return <LoadedComponent 
		value={loadedValue}
	/>
}

export default AsyncValue;
