import shortId from 'shortid';

interface FluxibleActionContext {
    dispatch: (action: string, payload?: unknown) => void;
}

interface Todo {
    id?: string;
    text: string;
    completed: boolean;
}

interface TogglePayload {
    id: string;
    completed: boolean;
}

export function toggleAll(context: FluxibleActionContext, value: boolean): void {
    const { dispatch } = context;

    dispatch('TOGGLE_ALL', value);
}

export function addTodo(context: FluxibleActionContext, todo: Todo): void {
    const { dispatch } = context;

    todo.id = shortId();

    dispatch('ADD_TODO', todo);
}

export function setCompleted(context: FluxibleActionContext, { id, completed }: TogglePayload): void {
    const { dispatch } = context;

    dispatch('TOGGLE', { id, completed });
}
