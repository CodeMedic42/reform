import isFinite from 'lodash/isFinite';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';

function processItem(promiseContext, item, index) {
    return Promise.resolve(promiseContext.cb(item, index))
    .then((result) => {
        promiseContext.processNext();

        return result;
    })
    .catch((error) => {
        promiseContext.stop();

        throw error;
    });
}

// This function loops over a list of items and calls the callback for each.
// If maxConcurrentCalls is provided and is less than the number of items in the list,
// then it will only call the callback up to that limit then wait for one to
// complete before starting on another.
function promiseForEach(list, cb, maxConcurrentCalls) {
    let iter = list;
    let useKeys = false;

    if (!isArray(list)) {
        useKeys = true;

        iter = keys(list);
    }

    const getIndex = (index) =>
        useKeys ? iter[index] : index;

    const limit = isFinite(maxConcurrentCalls) && maxConcurrentCalls > iter.length
        ? maxConcurrentCalls
        : iter.length;

    if (limit <= 0) {
        return Promise.resolve();
    }

    let nextIdx = 0;
    const current = [];
    let isDone = false;

    return new Promise((resolve) => {
        const promiseContext = {
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
                    list[realIndex],
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

            const nextItem = list[realIndex];

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