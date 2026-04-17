import { types, getSnapshot, Instance, SnapshotIn } from 'mobx-state-tree';
import TodoModel from './todo-model';

const TodoListModel = types.model('TodoList', {
    todos: types.array(TodoModel),
})
.actions((self) => ({
    setTodos(todos: SnapshotIn<typeof TodoModel>[]): void {
        self.todos.replace(todos as Instance<typeof TodoModel>[]);
    },
    appendTodos(todos: SnapshotIn<typeof TodoModel>[]): void {
        const current = getSnapshot(self.todos);

        self.todos.replace([...current, ...todos] as Instance<typeof TodoModel>[]);
    },
    addTodo(todo: SnapshotIn<typeof TodoModel>): void {
        self.todos.push(todo as Instance<typeof TodoModel>);
    },
}));

export default TodoListModel;
