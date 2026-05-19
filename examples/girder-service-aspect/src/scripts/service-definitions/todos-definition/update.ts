import { Command } from "@reformjs/girder-service-aspect";

export default new Command({
    url: '/todos/:id',
    method: 'post',
    retry: {},
    hooks: {},
});
