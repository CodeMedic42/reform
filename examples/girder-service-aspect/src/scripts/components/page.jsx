import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useAspect, useAction } from '@reformjs/girder-react-aspect';
import isEmpty from 'lodash/isEmpty';
import Todo from './todo';
import { toggleAll } from '../actions/todo-actions';

function Page() {
    const todoStore = useAspect('mobx').getStore('TodoListStore');

    const {
        todos: {
            retrieve,
            create,
        }
    } = useAspect('service');

    useEffect(() => { retrieve() }, []);

    const [tempValue, setTempValue] = useState('');

    const handleClick = useCallback(() => {
        create({
            data: {
                text: tempValue,
                completed: false,
            }
        }).then(() => {
            setTempValue('');
        });
    });

    const handleToggleClick = useAction(toggleAll);

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