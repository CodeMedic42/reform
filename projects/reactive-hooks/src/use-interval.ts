import React, { useState } from 'react';

export default function useInterval(cb: () => any, mill: number, initialValue = undefined) {
	const [value, setValue] = useState(initialValue);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setValue(cb());
		}, mill);

		return () => {
			clearInterval(interval);
		}
	}, []);
	
	return value;
}