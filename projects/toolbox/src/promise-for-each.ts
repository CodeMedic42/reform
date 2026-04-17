import isFinite from 'lodash/isFinite';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';

interface PromiseContext<T, R> {
    cb: (item: T, index: string | number) => R | Promise<R>;
    stop: () => void;
    processNext: () => void;
}

function processItem<T, R>(promiseContext: PromiseContext<T, R>, item: T, index: string | number): Promise<R> {
    return Promise.resolve(promiseContext.cb(item, index))
    .then((result: R) => {
        promiseContext.processNext();

        return result;
    })
    .catch((error: unknown) => {
        promiseContext.stop();

        throw error;
    });
}

// This function loops over a list of items and calls the callback for each.
// If maxConcurrentCalls is provided and is less than the number of items in the list,
// then it will only call the callback up to that limit then wait for one to
// complete before starting on another.
function promiseForEach<T, R>(
    list: T[] | Record<string, T>,
    cb: (item: T, index: string | number) => R | Promise<R>,
    maxConcurrentCalls?: number,
): Promise<void> {
    let iter: string[] | T[];
    let useKeys = false;

    if (!isArray(list)) {
        useKeys = true;

        iter = keys(list);
    } else {
        iter = list;
    }

    const getIndex = (index: number): string | number =>
        useKeys ? (iter as string[])[index] : index;

    const limit = isFinite(maxConcurrentCalls) && (maxConcurrentCalls as number) > iter.length
        ? (maxConcurrentCalls as number)
        : iter.length;

    if (limit <= 0) {
        return Promise.resolve();
    }

    let nextIdx = 0;
    const current: Promise<R>[] = [];
    let isDone = false;

    return new Promise<void>((resolve) => {
        const promiseContext: PromiseContext<T, R> = {
            cb,
            stop: () => {
                if (isDone) {
                    return;
                }

                isDone = true;

                resolve();
            },
            processNext: () => {
                if (isDone) {
                    return;
                }

                if (nextIdx >= iter.length) {
                    promiseContext.stop();

                    return;
                }

                const realIndex = getIndex(nextIdx);

                // Get the next items start to process it.
                current[nextIdx] = processItem(
                    promiseContext,
                    (list as Record<string | number, T>)[realIndex],
                    realIndex,
                );

                nextIdx += 1;
            },
        };

        // This loop will only take those items up to the limit.
        // Basically it starts a certain number of chains up to the limit.
        for (
            nextIdx;
            current.length < limit;
            nextIdx += 1
        ) {
            const realIndex = getIndex(nextIdx);

            const nextItem = (list as Record<string | number, T>)[realIndex];

            // Each chain is started by processing one items
            const prom = processItem(promiseContext, nextItem, realIndex);

            current.push(prom);
        }
    }).then (() => {
        // When all items have been processed we wait for all running processes to finish.
        Promise.all(current);
    });
}

export default promiseForEach;
