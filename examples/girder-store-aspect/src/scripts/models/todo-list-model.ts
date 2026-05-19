import { types, Instance, SnapshotIn } from 'mobx-state-tree';
import TodoModel from './todo-model';

const TodoListModel = types.model('TodoList', {
    todos: types.array(TodoModel),
})
.actions((self) => ({
    addTodo(todo: SnapshotIn<typeof TodoModel>): void {
        self.todos.push(todo as Instance<typeof TodoModel>);
    },
}));

export default TodoListModel;
