import {createStore} from 'fluxible/addons';
import find from 'lodash/find';
import isNil from 'lodash/isNil';

const TodoListStore = createStore({
    storeName: 'TodoListStore',
    handlers: {
        'ADD_TODO': 'addTodo',
        'TOGGLE_ALL': 'toggleAll',
        'TOGGLE': 'toggle',
    },
    initialize: function() {
        this.todos = [];
    },
    addTodo: function(todo) {
        this.todos.push(todo);

        this.emitChange();
    },
    toggleAll: function(completed) {
        this.todos.forEach((todo) => {
            todo.completed = completed;
        });

        this.emitChange();
    },
    toggle: function({ id, completed }) {
        const todo = find(this.todos, (todo) => todo.id === id);

        if (!isNil(todo)) {
            todo.completed = completed;

            this.emitChange();
        }
    },
    getState: function() {
        return {
            todos: this.todos
        }
    }
});

export default TodoListStore;
