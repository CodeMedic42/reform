import { types, getSnapshot } from 'mobx-state-tree';
import TodoModel from './todo-model';

const TodoListModel = types.model('TodoList', {
    todos: types.array(TodoModel),
})
.actions((self) => ({
    setTodos(todos) {
        self.todos = todos;
    },
    appendTodos(todos) {
        const current = getSnapshot(self.todos);

        self.todos = [...current, ...todos];
    },
    addTodo(todo) {
        self.todos.push(todo);
    },
}));

export default TodoListModel;