import React, { useState, useCallback } from 'react';
import { useAspect, useAction } from '@reformjs/girder-react-aspect';
import consoleGreet from '../actions/console-greet';

interface HelloAspect {
    greet: (name: string) => string;
}

function IncrementHook(): React.ReactElement {
    const [count, setCount] = useState<number>(0);

    const greetAction = useAction(consoleGreet);

    const handleClick = useCallback((): void => {
        setCount(count + 1);
        greetAction('Player 1');
    }, [count, greetAction]);

    const aspect = useAspect('hello') as HelloAspect;

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
