import React, { useState, useCallback } from 'react';

function Increment() {
    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => setCount(count + 1));

    return (
        <div>
            {count}
            <button
                type="button"
                onClick={handleClick}
            >
                Increment
            </button>
        </div>
    );
}

export default Increment;