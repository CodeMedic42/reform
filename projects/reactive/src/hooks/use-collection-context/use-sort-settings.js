import { useCallback, useMemo } from 'react';
import isNil from 'lodash/isNil';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import { isArray } from 'lodash';

function sortCheck(left, right) {
    if (left > right) {
        return 1;
    }

    if (left < right) {
        return -1;
    }

    return 0;
}

function sorter(by, order, left, right) {
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

function insertSort(currentList, newList, by, order) {
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

function getPropToLower(prop, listItem) {
    const value = listItem.getValue(prop);

    if (!isNil(value)) {
        return `${value}`.toLowerCase();
    }

    return value;
}

function getProp(prop, listItem) {
    return listItem.getValue(prop);
}

function getFilterPriority(listItem) {
    return listItem.getFilterPriority();
}

function getIndex(listItem) {
    return listItem.getOriginalIndex();
}

function processSortRules(sortRules) {
    const by = [];
    const order = [];
    let filterPriorityUsed = false;

    let preRules = sortRules;

    if (!isArray(preRules)) {
        preRules = [preRules];
    }

    forEach(
        preRules,
        (sortRule) => {
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
        [],
    );

    by.push(getIndex);
    order.push('asc');

    return {
        by,
        order,
        filterPriorityUsed,
    };
}

function useSortSettings(settings) {
    const rules = settings?.rules ?? null;

    const {
        by,
        order,
        filterPriorityUsed,
    } = useMemo(() => processSortRules(rules), [rules]);

    const insert = useCallback((items, newItems) => {
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
