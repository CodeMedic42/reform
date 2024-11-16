import { Command } from "@reformjs/girder-service-aspect";

export default new Command({
    url: 'todos/toggle',
    method: 'put',
    retry: {},
    hooks: {
        onSuccess: (context, response) => {
            const todoListStore = context.getAspect('mobx').getStore('TodoListStore');

            todoListStore.setTodos(response.data);
        },
    },
});
