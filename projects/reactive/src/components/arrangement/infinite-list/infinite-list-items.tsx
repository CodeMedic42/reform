import React, { Fragment, useContext } from 'react';
import classnames from 'classnames';
import { get, isNil } from 'lodash-es';
import InfiniteListContext, { InfiniteListContextValue } from './infinite-list-context.js';

export interface InfiniteListItemsProps {
    className?: string | null;
    Component?: React.ElementType;
    items?: unknown[] | null;
    render: (item: unknown, index: number[]) => React.ReactNode;
    [key: string]: unknown;
}

function load(
    collection: unknown[] | null | undefined,
    context: InfiniteListContextValue,
    cb: (item: unknown, index: number[], count: number) => React.ReactNode,
): React.ReactNode[] {
    const {
        minIndexes,
        maxIndexes,
        fromIndexes,
        fromCount,
        toCount,
    } = context;

    const arr: React.ReactNode[] = [];
    const currentIndexes = [...fromIndexes];

    for (let counter = fromCount; counter < toCount; counter += 1) {
        let done = false;

        const item = get(collection, currentIndexes);

        arr.push(cb(item, currentIndexes, counter));

        let index = currentIndexes.length - 1;

        while (!done) {
            if (index < 0) {
                if (counter <= toCount) {
                    throw new Error('Should not happen');
                }

                done = true;
            } else {
                currentIndexes[index] += 1;

                if (!isNil(maxIndexes[index]) && currentIndexes[index] > (maxIndexes[index] as number)) {
                    currentIndexes[index] = minIndexes[index];

                    index -= 1;
                } else {
                    done = true;
                }
            }
        }
    }

    return arr;
}

function InfiniteListItems(props: InfiniteListItemsProps): React.ReactElement {
    const {
        className,
        items,
        render,
        Component = 'div',
        ...rest
    } = props;

    const context = useContext(InfiniteListContext);

    const { itemsRef } = context!;

    return (
        <Component ref={itemsRef} className={classnames('ra-infinite-list-items', className)} {...rest}>
            {load(items, context!, (item, index, count) => (
                <Fragment key={count}>
                    {render(item, index)}
                </Fragment>
            ))}
        </Component>
    );
}

export default InfiniteListItems;
