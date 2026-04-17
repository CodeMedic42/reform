import React, { useCallback } from 'react';
import {
    useFluxible,
} from 'fluxible-addons-react';
import { setCompleted } from '../actions/todo-actions';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

interface TodoProps {
    todo: TodoItem;
}

function Todo(props: TodoProps): React.ReactElement {
    const {
        todo,
    } = props;

    const fluxContext = useFluxible();

    const handleChange = useCallback((): void => {
        fluxContext.executeAction(setCompleted, {
            id: todo.id,
            completed: !todo.completed,
        });
    }, [todo]);

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleChange}
                />
                {todo.text}
            </label>
        </div>
    );
}

export default Todo;
