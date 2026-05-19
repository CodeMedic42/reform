import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { useAspect } from '@reformjs/girder-react-aspect';

interface TodoItem {
    text: string;
    completed: boolean;
    id?: string;
    setCompleted(completed: boolean): void;
}

interface TodoProps {
    todo: TodoItem;
}

function Todo(props: TodoProps): React.ReactElement {
    const {
        todo,
    } = props;

    const {
        text,
        completed,
        id,
    } = todo;

    const {
        todo: {
            update,
        }
    } = useAspect('service');

    const handleChange = useCallback(() => {
        update(
            {
                data: {
                    text,
                    completed: !completed,
                },
                routeParams: {
                    id,
                }
            }
        ).then(() => {
            todo.setCompleted(!completed);
        });
    }, [completed, text, update, id]);

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={handleChange}
                />
                {text}
            </label>
        </div>
    );
}

export default observer(Todo);
