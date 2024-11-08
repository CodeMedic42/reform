export function toggleAll(context, value) {
    const {
        mobx: {
            getStore,
        }
    } = context;

    const todoListStore = getStore('TodoListStore');

    todoListStore.todos.forEach((todo) => {
        todo.setCompleted(value);
    });
}
