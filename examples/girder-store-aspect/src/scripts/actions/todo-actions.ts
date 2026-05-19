interface TodoItem {
    setCompleted(completed: boolean): void;
}

interface MobxAspect {
    getStore(name: string): {
        todos: TodoItem[];
    };
}

interface StoreContext {
    getAspect(name: string): MobxAspect;
}

export function toggleAll(context: StoreContext, value: boolean): void {
    const { getStore } = context.getAspect('mobx');

    const todoListStore = getStore('TodoListStore');

    todoListStore.todos.forEach((todo: TodoItem) => {
        todo.setCompleted(value);
    });
}
