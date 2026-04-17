import { Command } from "@reformjs/girder-service-aspect";

export default new Command({
    url: 'todos',
    method: 'get',
    retry: {},
    hooks: {
        onSuccess: (context, response) => {
            const todoListStore = context.getAspect('mobx').getStore('TodoListStore');

            todoListStore.appendTodos(response.data);
        },
    },
});
