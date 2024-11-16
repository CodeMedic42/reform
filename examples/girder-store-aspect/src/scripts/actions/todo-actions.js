export function toggleAll(context, value) {
    const { getStore } = context.getAspect('mobx');

    const todoListStore = getStore('TodoListStore');

    todoListStore.todos.forEach((todo) => {
        todo.setCompleted(value);
    });
}
