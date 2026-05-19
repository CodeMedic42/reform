import { useState } from 'react';

export default function usePromise<T>(promise: Promise<T | undefined>, initialValue: T | undefined = undefined) {
	const [status, setStatus] = useState({
		result: initialValue,
		error: null,
	});

	Promise.resolve(promise)
		.then((result) => {
			setStatus({
				result,
				error: null,
			});
		})
		.catch((error) => {
			setStatus({
				...status,
				error,
			})
		});

}