import React, { useCallback } from 'react';
import {
    useFluxible,
} from 'fluxible-addons-react';
import { setCompleted } from '../actions/todo-actions';

function Todo(props) {
    const {
        todo,
    } = props;

    const fluxContext = useFluxible();

    const handleChange = useCallback(() => {
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