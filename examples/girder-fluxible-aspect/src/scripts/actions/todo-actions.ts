import shortId from 'shortid';

export function toggleAll(context, value) {
    const { dispatch } = context;

    dispatch('TOGGLE_ALL', value);
}

export function addTodo(context, todo) {
    const { dispatch } = context;

    todo.id = shortId();

    dispatch('ADD_TODO', todo);
}

export function setCompleted(context, { id, completed }) {
    const { dispatch } = context;

    dispatch('TOGGLE', { id, completed });
}
