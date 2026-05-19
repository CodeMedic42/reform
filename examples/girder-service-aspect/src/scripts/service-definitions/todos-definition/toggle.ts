import { Command } from "@reformjs/girder-service-aspect";

interface ServiceHookContext {
    getAspect(name: string): {
        getStore(name: string): {
            setTodos(todos: Array<{ text: string; completed: boolean; id?: string }>): void;
        };
    };
}

interface ServiceResponse {
    data: Array<{ text: string; completed: boolean; id?: string }>;
}

export default new Command({
    url: 'todos/toggle',
    method: 'put',
    retry: {},
    hooks: {
        onSuccess: (context: ServiceHookContext, response: ServiceResponse) => {
            const todoListStore = context.getAspect('mobx').getStore('TodoListStore');

            todoListStore.setTodos(response.data);
        },
    },
});
