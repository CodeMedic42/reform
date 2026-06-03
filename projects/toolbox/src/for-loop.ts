function forLoop<T>(start: number, end: number, cb: (index: number) => T): T[] {
    const items: T[] = [];

    for (let counter = start; counter < end; counter += 1) {
        items[counter] = cb(counter);
    }

    return items;
}

export default forLoop;
