import {createStore} from 'fluxible/addons';
import { find, isNil } from 'lodash-es';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface TogglePayload {
    id: string;
    completed: boolean;
}

interface TodoStoreInstance {
    todos: Todo[];
    emitChange: () => void;
}

const TodoListStore = createStore({
    storeName: 'TodoListStore',
    handlers: {
        'ADD_TODO': 'addTodo',
        'TOGGLE_ALL': 'toggleAll',
        'TOGGLE': 'toggle',
    },
    initialize: function(this: TodoStoreInstance): void {
        this.todos = [];
    },
    addTodo: function(this: TodoStoreInstance, todo: Todo): void {
        this.todos.push(todo);

        this.emitChange();
    },
    toggleAll: function(this: TodoStoreInstance, completed: boolean): void {
        this.todos.forEach((todo: Todo) => {
            todo.completed = completed;
        });

        this.emitChange();
    },
    toggle: function(this: TodoStoreInstance, { id, completed }: TogglePayload): void {
        const todo = find(this.todos, (todo: Todo) => todo.id === id);

        if (!isNil(todo)) {
            todo.completed = completed;

            this.emitChange();
        }
    },
    getState: function(this: TodoStoreInstance): { todos: Todo[] } {
        return {
            todos: this.todos
        }
    }
});

export default TodoListStore;
