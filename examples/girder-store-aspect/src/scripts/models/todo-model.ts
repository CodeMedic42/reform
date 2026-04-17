import { types } from 'mobx-state-tree';

const TodoModel = types.model('Todo', {
    text: types.string,
    completed: types.boolean,
})
.actions((self) => ({
    setCompleted(completed: boolean): void {
        self.completed = completed;
    },
}));

export default TodoModel;
