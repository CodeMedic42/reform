import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

function Todo(props) {
    const {
        todo,
    } = props;

    const handleChange = useCallback(() => {
        todo.setCompleted(!todo.completed);
    }, [todo.completed]);

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

export default observer(Todo);