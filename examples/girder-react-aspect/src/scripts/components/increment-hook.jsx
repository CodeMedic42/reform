import React, { useState, useCallback } from 'react';
import { useAspect, useAction } from '@reformjs/girder-react-aspect';
import consoleGreet from '../actions/console-greet';

function IncrementHook() {
    const [count, setCount] = useState(0);

    const greetAction = useAction(consoleGreet);

    const handleClick = useCallback(() => {
        setCount(count + 1);
        greetAction('Player 1');
    });

    const aspect = useAspect('hello');

    return (
        <div>
            <div>
                {aspect.greet('Player 1')}
            </div>
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

export default IncrementHook;