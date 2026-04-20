import React, { useCallback, useState } from 'react';
import { isEmpty } from 'lodash-es';
import {
    connectToStores,
    useFluxible,
} from 'fluxible-addons-react';
import Todo from './todo';
import { addTodo, toggleAll } from '../actions/todo-actions';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

interface PageProps {
    todos: TodoItem[];
}

function Page({ todos }: PageProps): React.ReactElement {
    const fluxContext = useFluxible();

    const [tempValue, setTempValue] = useState<string>('');

    const handleClick = useCallback((): void => {
        fluxContext.executeAction(addTodo, {
            text: tempValue,
            completed: false,
        });

        setTempValue('');
    });

    const handleToggleClick = useCallback((): void => {
        fluxContext.executeAction(toggleAll, true);
    });

    return (
        <div>
            <input
                value={tempValue}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTempValue(event.target.value)}
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
                todos.map((todo: TodoItem, index: number) => {
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
    (context: { getStore: (name: string) => { todos: TodoItem[] } }, props: Record<string, unknown>) => {
        const store = context.getStore('TodoListStore');

        return {
            todos: store.todos,
        };
    }
);
