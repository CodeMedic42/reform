import { types } from 'mobx-state-tree';
import TodoModel from './todo-model';

const TodoListModel = types.model('TodoList', {
    todos: types.array(TodoModel),
})
.actions((self) => ({
    addTodo(todo) {
        self.todos.push(todo);
    },
}));

export default TodoListModel;