import React, { useCallback } from 'react';
import { observer } from 'mobx-react';

interface TodoItem {
    text: string;
    completed: boolean;
    setCompleted(completed: boolean): void;
}

interface TodoProps {
    todo: TodoItem;
}

function Todo(props: TodoProps): React.ReactElement {
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
