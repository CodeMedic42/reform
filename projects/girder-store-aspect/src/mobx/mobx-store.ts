import isNil from 'lodash/isNil';

const FIELDS = {
    id: Symbol('id'),
    Model: Symbol('Model'),
    actions: Symbol('actions'),
    initialValue: Symbol('initialValue'),
};

class MobxStore {
    constructor(id, Model, initialValue) {
        if (isNil(id)) {
            throw new Error('A store requires an id');
        }

        if (isNil(Model)) {
            throw new Error('A store requires a Model');
        }

        this[FIELDS.id] = id;
        this[FIELDS.Model] = Model;
        this[FIELDS.initialValue] = initialValue;
    }

    get id() {
        return this[FIELDS.id];
    }

    create() {
        const StoreModel = this[FIELDS.Model];

        return StoreModel.create(this[FIELDS.initialValue]);
    }
}

export default MobxStore;
