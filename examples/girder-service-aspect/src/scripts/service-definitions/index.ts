import todosDefinition from "./todos-definition";
import todoDefinition from "./todo-definition";

interface ServiceDefinitions {
    todos: typeof todosDefinition;
    todo: typeof todoDefinition;
}

const serviceDefinitions: ServiceDefinitions = {
    todos: todosDefinition,
    todo: todoDefinition,
};

export default serviceDefinitions;
