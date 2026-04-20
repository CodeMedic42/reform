import { useCallback, useMemo } from 'react';
import { isNil, orderBy, isEmpty, forEach, isString, isArray } from 'lodash-es';
import CollectionItem from './collection-item.js';

type SortAccessor = (item: CollectionItem) => any;

function sortCheck(left: any, right: any): number {
    if (left > right) {
        return 1;
    }

    if (left < right) {
        return -1;
    }

    return 0;
}

function sorter(by: SortAccessor[], order: ('asc' | 'desc')[], left: CollectionItem, right: CollectionItem): number {
    let result = 0;

    forEach(by, (target, index) => {
        const leftTarget = target(left);
        const rightTarget = target(right);

        result = sortCheck(leftTarget, rightTarget);

        if (order[index] === 'desc') {
            result *= -1;
        }

        return result === 0;
    });

    return result;
}

function insertSort(currentList: CollectionItem[], newList: CollectionItem[], by: SortAccessor[], order: ('asc' | 'desc')[]): CollectionItem[] {
    if (isEmpty(currentList)) {
        return newList;
    }

    let counter = 0;

    forEach(newList, (newItem) => {
        let added = false;

        for (counter; !added && counter < currentList.length; counter += 1) {
            const currentItem = currentList[counter];

            const result = sorter(by, order, newItem, currentItem);

            if (result < 0) {
                // Should be placed before this one
                currentList.splice(counter, 0, newItem);

                added = true;
            }
        }

        if (!added) {
            currentList.splice(counter, 0, newItem);
        }
    });

    return currentList;
}

function getPropToLower(prop: string, listItem: CollectionItem): string | null {
    const value = listItem.getValue(prop);

    if (!isNil(value)) {
        return `${value}`.toLowerCase();
    }

    return value ?? null;
}

function getProp(prop: string, listItem: CollectionItem): any {
    return listItem.getValue(prop);
}

function getFilterPriority(listItem: CollectionItem): number | null {
    return listItem.getFilterPriority();
}

function getIndex(listItem: CollectionItem): number {
    return listItem.getOriginalIndex();
}

function processSortRules(sortRules: any): { by: SortAccessor[]; order: ('asc' | 'desc')[]; filterPriorityUsed: boolean } {
    const by: SortAccessor[] = [];
    const order: ('asc' | 'desc')[] = [];
    let filterPriorityUsed = false;

    let preRules = sortRules;

    if (!isArray(preRules)) {
        preRules = [preRules];
    }

    forEach(
        preRules,
        (sortRule: any) => {
            if (isNil(sortRule)) {
                return;
            }

            if (isString(sortRule)) {
                by.push(getPropToLower.bind(null, sortRule));

                order.push('asc');
            } else {
                order.push(sortRule.order === 'desc' ? 'desc' : 'asc');

                if (sortRule.type === 'filter') {
                    by.push(getFilterPriority);

                    filterPriorityUsed = true;
                } else if (
                    isNil(sortRule.type) || sortRule.type === 'property'
                ) {
                    if (sortRule.as === 'string') {
                        if (sortRule.caseSensitive) {
                            by.push(getProp.bind(null, sortRule.path));
                        } else {
                            by.push(getPropToLower.bind(null, sortRule.path));
                        }
                    } else if (sortRule.as === 'number') {
                        by.push(getProp.bind(null, sortRule.path));
                    }
                } else {
                    throw new Error('type is invalid');
                }
            }
        },
    );

    by.push(getIndex);
    order.push('asc');

    return {
        by,
        order,
        filterPriorityUsed,
    };
}

export interface SortSettings {
    rules?: any;
}

export interface SortState {
    rules: any;
    insert: (items: CollectionItem[], newItems: CollectionItem[]) => CollectionItem[];
    filterPriorityUsed: boolean;
}

function useSortSettings(settings?: SortSettings | null): SortState {
    const rules = settings?.rules ?? null;

    const {
        by,
        order,
        filterPriorityUsed,
    } = useMemo(() => processSortRules(rules), [rules]);

    const insert = useCallback((items: CollectionItem[], newItems: CollectionItem[]) => {
        const sortedItems = orderBy(newItems, by, order);

        if (items.length <= 0) {
            return sortedItems;
        }

        // Everything else is already sorted so just insert at the correct locations
        return insertSort(items, sortedItems, by, order);
    }, [by, order]);

    return useMemo(() => ({
        rules,
        insert,
        filterPriorityUsed,
    }), [rules, filterPriorityUsed, insert]);
}

export default useSortSettings;
