import { MobxStore } from '@reformjs/girder-store-aspect/mobx';
import TodoListModel from '../models/todo-list-model';

export default new MobxStore('TodoListStore', TodoListModel, {
    todos: [],
});