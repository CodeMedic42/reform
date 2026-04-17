import { get, isEmpty } from 'lodash-es';

const FIELDS = {
    id: Symbol('id'),
    value: Symbol('value'),
    filterPriority: Symbol('filterPriority'),
    originalIndex: Symbol('originalIndex'),
};

class CollectionItem {
    [key: symbol]: any;

    constructor(id: string | null, value: any, index: number, accessSymbol: symbol) {
        this[FIELDS.id] = id;
        this[FIELDS.value] = value;
        this[FIELDS.originalIndex] = index;
        this[FIELDS.filterPriority] = null;

        this[accessSymbol] = {
            setFilterPriority: (filterPriority: number) => {
                this[FIELDS.filterPriority] = filterPriority;
            },
        };
    }

    getValue(path?: string, defaultValue?: any): any {
        if (isEmpty(path)) {
            return this[FIELDS.value];
        }

        return get(this[FIELDS.value], path!, defaultValue);
    }

    getId(): string | null {
        return this[FIELDS.id];
    }

    getOriginalIndex(): number {
        return this[FIELDS.originalIndex];
    }

    getFilterPriority(): number | null {
        return this[FIELDS.filterPriority];
    }
}

export default CollectionItem;
