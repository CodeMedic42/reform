import isNil from 'lodash/isNil';

function forMap(collection, start = 0, end = 0, cb) {
    const items = [];

    if (!isNil(collection)) {
        for (let counter = start; counter < end; counter += 1) {
            items[counter] = cb(collection[counter], counter);
        }
    }

    return items;
}

export default forMap;