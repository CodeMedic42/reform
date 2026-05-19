import { Command } from "@reformjs/girder-service-aspect";

interface ServiceHookContext {
    getAspect(name: string): {
        getStore(name: string): {
            appendTodos(todos: Array<{ text: string; completed: boolean; id?: string }>): void;
        };
    };
}

interface ServiceResponse {
    data: Array<{ text: string; completed: boolean; id?: string }>;
}

export default new Command({
    url: 'todos',
    method: 'get',
    retry: {},
    hooks: {
        onSuccess: (context: ServiceHookContext, response: ServiceResponse) => {
            const todoListStore = context.getAspect('mobx').getStore('TodoListStore');

            todoListStore.appendTodos(response.data);
        },
    },
});
