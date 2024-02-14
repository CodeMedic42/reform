/* eslint-disable max-len */
import { useCallback, useMemo } from 'react';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import useFilterSettings from './use-filter-settings';
import useSortSettings from './use-sort-settings';
import CollectionItem from './collection-item';

function echo(val) {
    return val;
}

const ACCESS_SYMBOL = Symbol('AccessSymbol');

function appendItems(items, newItems, getId, beforeInsert, filterState, sortState) {
    const ids = {};

    if (isEmpty(newItems)) {
        return {
            ids,
            items,
        };
    }

    const count = items.length;

    const listItems = map(newItems, (newItem, index) => {
        let id = null;

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

function useCollectionContext(rawItems, options) {
    // const idsRef = useRef({ ids: {} });

    const op = isFunction(options) ? options() : options;

    const filterState = useFilterSettings(op?.filterSettings);

    const sortState = useSortSettings(op?.sortSettings);

    const getId = useMemo(() => (isFunction(options?.getId) ? options.getId : null));
    const beforeInsert = useMemo(() => (isFunction(options?.beforeInsert) ? options.beforeInsert : echo));

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

    const getById = useCallback((id) => ids[id], [ids]);

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
