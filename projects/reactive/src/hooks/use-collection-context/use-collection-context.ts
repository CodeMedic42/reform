/* eslint-disable max-len */
import { useCallback, useMemo } from 'react';
import { isFunction, forEach, isEmpty, map, isNil } from 'lodash-es';
import useFilterSettings, { FilterSettings, FilterState } from './use-filter-settings.js';
import useSortSettings, { SortSettings, SortState } from './use-sort-settings.js';
import CollectionItem from './collection-item.js';

function echo<T>(val: T): T {
    return val;
}

const ACCESS_SYMBOL = Symbol('AccessSymbol');

export interface CollectionOptions {
    filterSettings?: FilterSettings;
    sortSettings?: SortSettings;
    getId?: (item: any) => string;
    beforeInsert?: (item: any) => any;
}

function appendItems(
    items: CollectionItem[],
    newItems: any[],
    getId: ((item: any) => string) | null,
    beforeInsert: (item: any) => any,
    filterState: FilterState,
    sortState: SortState,
): { ids: Record<string, CollectionItem>; items: CollectionItem[] } {
    const ids: Record<string, CollectionItem> = {};

    if (isEmpty(newItems)) {
        return {
            ids,
            items,
        };
    }

    const count = items.length;

    const listItems = map(newItems, (newItem, index) => {
        let id: string | null = null;

        if (!isNil(getId)) {
            id = getId(newItem);

            if (!isNil(ids[id])) {
                throw new Error(`Invalid duplicate id: "${id}"`);
            }
        }

        const finalItem = beforeInsert(newItem);

        const collectionItem = new CollectionItem(
            id,
            finalItem,
            count + index,
            ACCESS_SYMBOL,
        );

        collectionItem[ACCESS_SYMBOL].setFilterPriority(filterState.processValue(finalItem));

        if (!isNil(id)) {
            // eslint-disable-next-line no-param-reassign
            ids[id] = collectionItem;
        }

        return collectionItem;
    });

    return {
        ids,
        items: sortState.insert(items, listItems),
    };
}

function useCollectionContext(rawItems: any[], options?: CollectionOptions | (() => CollectionOptions)): [CollectionItem[], { getById: (id: string) => CollectionItem }] {
    // const idsRef = useRef({ ids: {} });

    const op = isFunction(options) ? options() : options;

    const filterState = useFilterSettings(op?.filterSettings);

    const sortState = useSortSettings(op?.sortSettings);

    const getId = useMemo(() => (isFunction((options as CollectionOptions)?.getId) ? (options as CollectionOptions).getId! : null));
    const beforeInsert = useMemo(() => (isFunction((options as CollectionOptions)?.beforeInsert) ? (options as CollectionOptions).beforeInsert! : echo));

    let processed = false;

    const { items, ids } = useMemo(
        () => {
            processed = true;

            return appendItems([], rawItems, getId, beforeInsert, filterState, sortState);
        },
        [rawItems],
    );

    let sorted = false;

    const filteredItems = useMemo(() => {
        if (processed) {
            return items;
        }

        forEach(items, (item) => {
            const itemValue = item.getValue();
            const filterPriority = filterState.processValue(itemValue);

            item[ACCESS_SYMBOL].setFilterPriority(filterPriority);
        });

        if (sortState.filterPriorityUsed) {
            sorted = true;

            return sortState.insert([], items);
        }

        return items;
    }, [filterState]);

    const sortedItems = useMemo(() => {
        if (processed || sorted) {
            return filteredItems;
        }

        return sortState.insert([], filteredItems);
    }, [sortState]);

    const getById = useCallback((id: string) => ids[id], [ids]);

    return [sortedItems,
        useMemo(
            () => ({
                getById,
            }),
            [getById],
        ),
    ];
}

export default useCollectionContext;
