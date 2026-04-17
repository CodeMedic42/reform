
import { types } from 'mobx-state-tree';

const TodoModel = types.model('Todo', {
    text: types.string,
    completed: types.boolean,
    id: types.maybe(types.string),
})
.actions((self) => ({
    setCompleted(completed) {
        self.completed = completed;
    },
}));

export default TodoModel;