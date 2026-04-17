import isNil from 'lodash/isNil';

interface MobxModel {
    create(initialValue?: unknown): unknown;
}

const FIELDS = {
    id: Symbol('id'),
    Model: Symbol('Model'),
    actions: Symbol('actions'),
    initialValue: Symbol('initialValue'),
};

class MobxStore {
    [key: symbol]: unknown;

    constructor(id: string, Model: MobxModel, initialValue?: unknown) {
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

    get id(): string {
        return this[FIELDS.id] as string;
    }

    create(): unknown {
        const StoreModel = this[FIELDS.Model] as MobxModel;

        return StoreModel.create(this[FIELDS.initialValue]);
    }
}

export default MobxStore;
