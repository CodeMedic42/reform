import { isNil } from 'lodash-es';

function forMap<T, R>(collection: T[] | null | undefined, cb: (item: T, index: number) => R, start: number = 0, end: number = 0): R[] {
    const items: R[] = [];

    if (!isNil(collection)) {
        for (let counter = start; counter < end; counter += 1) {
            items[counter] = cb(collection[counter], counter);
        }
    }

    return items;
}

export default forMap;
