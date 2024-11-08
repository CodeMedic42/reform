import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import { useAspect } from '@reformjs/girder-react-aspect';
import Todo from './todo';

function Page() {
    const todoStore = useAspect('mobx').getStore('TodoListStore');

    const [tempValue, setTempValue] = useState('');

    const handleClick = useCallback(() => {
        todoStore.addTodo({
            text: tempValue,
            completed: false,
        });

        setTempValue('');
    });

    return (
        <div>
            <input
                value={tempValue}
                onChange={(event) => setTempValue(event.target.value)}
            />
            <button
                onClick={handleClick}
            >
                Create Todo
            </button>
            {
                todoStore.todos.map((todo, index) => {
                    return (
                        <Todo key={index} todo={todo}/>
                    );
                })
            }
        </div>
    );
}

export default observer(Page);