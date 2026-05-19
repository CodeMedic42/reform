function forLoop<T>(start: number = 0, end: number = 0, cb: (index: number) => T): T[] {
    const items: T[] = [];

    for (let counter = start; counter < end; counter += 1) {
        items[counter] = cb(counter);
    }

    return items;
}

export default forLoop;
