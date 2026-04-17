import React, { useState } from 'react';

function useInterval(cb, mill, initialValue = undefined) {
    const [value, setValue] = useState(initialValue);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setValue(cb());
        }, mill);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return value;
}

export { useInterval as default };
