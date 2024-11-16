import { Command } from "@reformjs/girder-service-aspect";

export default new Command({
    url: '/todos',
    method: 'post',
    retry: {},
    hooks: {
        onSuccess: (context, response) => {
            const todoListStore = context.getAspect('mobx').getStore('TodoListStore');

            todoListStore.appendTodos([ response.data ]);
        },
    },
});
