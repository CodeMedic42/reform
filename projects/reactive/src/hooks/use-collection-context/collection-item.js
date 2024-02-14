import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const FIELDS = {
    id: Symbol('id'),
    value: Symbol('value'),
    filterPriority: Symbol('filterPriority'),
    originalIndex: Symbol('originalIndex'),
};

class CollectionItem {
    constructor(id, value, index, accessSymbol) {
        this[FIELDS.id] = id;
        this[FIELDS.value] = value;
        this[FIELDS.originalIndex] = index;
        this[FIELDS.filterPriority] = null;

        this[accessSymbol] = {
            setFilterPriority: (filterPriority) => {
                this[FIELDS.filterPriority] = filterPriority;
            },
        };
    }

    getValue(path, defaultValue) {
        if (isEmpty(path)) {
            return this[FIELDS.value];
        }

        return get(this[FIELDS.value], path, defaultValue);
    }

    getId() {
        return this[FIELDS.id];
    }

    getOriginalIndex() {
        return this[FIELDS.originalIndex];
    }

    getFilterPriority() {
        return this[FIELDS.filterPriority];
    }
}

export default CollectionItem;
