function forLoop(cb, start = 0, end = 0) {
    const items = [];

    for (let counter = start; counter < end; counter += 1) {
        items[counter] = cb(counter);
    }

    return items;
}

export default forLoop;