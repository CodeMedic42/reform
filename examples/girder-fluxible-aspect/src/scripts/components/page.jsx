import React, { useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
    connectToStores,
    useFluxible,
} from 'fluxible-addons-react';
import Todo from './todo';
import { addTodo, toggleAll } from '../actions/todo-actions';

function Page({ todos }) {
    const fluxContext = useFluxible();

    const [tempValue, setTempValue] = useState('');

    const handleClick = useCallback(() => {
        fluxContext.executeAction(addTodo, {
            text: tempValue,
            completed: false,
        });

        setTempValue('');
    });

    const handleToggleClick = useCallback(() => {
        fluxContext.executeAction(toggleAll, true);
    });

    return (
        <div>
            <input
                value={tempValue}
                onChange={(event) => setTempValue(event.target.value)}
            />
            <button
                onClick={handleClick}
                disabled={isEmpty(tempValue)}
            >
                Create Todo
            </button>
            <button
                onClick={() => handleToggleClick(true)}
            >
                Mark All Completed
            </button>
            {
                todos.map((todo, index) => {
                    return (
                        <Todo key={index} todo={todo}/>
                    );
                })
            }
        </div>
    );
}

export default connectToStores(
    Page,
    ['TodoListStore'],
    (context, props) => {
        const store = context.getStore('TodoListStore');

        return {
            todos: store.todos,
        };
    }
);
