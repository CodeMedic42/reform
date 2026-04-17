import React, { useLayoutEffect, forwardRef, useImperativeHandle, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import { isNil, isNumber, isFinite } from 'lodash-es';
import scrollIntoView from 'scroll-into-view-if-needed';
import useThrottleCallback from '../../../hooks/use-throttle-callback.js';
import InfiniteListContext, { InfiniteListContextValue } from './infinite-list-context.js';

type CountingType = number | number[];

export interface InfiniteListProps {
    id?: string | null;
    className?: string | null;
    Component?: React.ElementType;
    children?: React.ReactNode;
    firstIndex?: CountingType | null;
    lastIndex?: CountingType | null;
    minIndex?: CountingType | null;
    maxIndex?: CountingType | null;
    startingIndex?: CountingType | null;
    onLoad?: ((loadStart: number[], loadEnd: number[]) => void) | null;
    loadCount: number;
    bufferCount: number;
    items?: unknown[] | null;
    hold?: boolean;
    keepLoaded?: boolean;
    onTopIndexChange?: ((index: number) => void) | null;
    topOffset?: number | boolean;
    [key: string]: unknown;
}

export interface InfiniteListHandle {
    gotoIndex: (gotoIndex: number | number[] | null) => void;
}

function getNumberChildrenBefore(
    parent: HTMLElement,
    itemsContainer: HTMLElement,
    topOffset: number,
    getTopIndex: boolean,
): { count: number; visibleIndex: number | null } {
    let count = 0;
    let visibleIndex: number | null = null;

    if (itemsContainer.childNodes.length > 0) {
        const parentRect = parent.getBoundingClientRect();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const child = itemsContainer.childNodes[count] as HTMLElement;
            const childRect = child.getBoundingClientRect();

            if (childRect.bottom < (parentRect.top + topOffset)) {
                count += 1;
            } else {
                break;
            }
        }

        if (getTopIndex) {
            const firstVisible = count;
            const visible = itemsContainer.childNodes[firstVisible] as HTMLElement;

            if (!isNil(visible)) {
                const visibleRect = visible.getBoundingClientRect();

                const visibleDiff = visibleRect.bottom - (parentRect.top + topOffset);

                if (visibleRect.height / 2 < visibleDiff) {
                    visibleIndex = firstVisible;
                } else if (!isNil(itemsContainer.childNodes[count + 2])) {
                    visibleIndex = firstVisible + 1;
                } else {
                    visibleIndex = firstVisible;
                }
            }
        }
    }

    return {
        count,
        visibleIndex,
    };
}

function getNumberChildrenAfter(parent: HTMLElement, itemsContainer: HTMLElement): number {
    if (itemsContainer.childNodes.length <= 0) {
        return 0;
    }

    let count = itemsContainer.childNodes.length;

    const parentRect = parent.getBoundingClientRect();

    // eslint-disable-next-line no-constant-condition
    while (count > 0) {
        const child = itemsContainer.childNodes[count - 1] as HTMLElement;
        const childRect = child.getBoundingClientRect();

        if (childRect.top > parentRect.bottom) {
            count -= 1;
        } else {
            break;
        }
    }

    return itemsContainer.childNodes.length - count;
}

function getIndexCount(count: number | null, value: number | null, multiplier: number): number | null {
    if (isNil(count) || isNil(value)) {
        return null;
    }

    return (value * multiplier) + count;
}

interface ValidatedIndexes {
    minIndexes: number[];
    maxIndexes: (number | null)[];
    startingIndexes: number[];
    multipliers: number[];
    firstCount: number;
    startingCount: number;
    lastCount: number | null;
}

function validateIndexes(
    minIndex: CountingType | null | undefined,
    maxIndex: CountingType | null | undefined,
    firstIndex: CountingType | null | undefined,
    lastIndex: CountingType | null | undefined,
    startingIndex: CountingType | null | undefined,
): ValidatedIndexes {
    let minIndexes: (number | null)[];
    let maxIndexes: (number | null)[];
    let firstIndexes: (number | null)[];
    let lastIndexes: (number | null)[];
    let startingIndexes: (number | null)[];

    if (isNil(minIndex)) {
        minIndexes = [0];
    } else if (isFinite(minIndex)) {
        minIndexes = [minIndex as number];
    } else {
        minIndexes = [...(minIndex as number[])];
    }

    if (isNil(maxIndex)) {
        maxIndexes = [null];
    } else if (isFinite(maxIndex)) {
        maxIndexes = [maxIndex as number];
    } else {
        maxIndexes = [...(maxIndex as number[])];
    }

    if (isNil(firstIndex)) {
        firstIndexes = [...minIndexes];
    } else if (isFinite(firstIndex)) {
        firstIndexes = [firstIndex as number];
    } else {
        firstIndexes = [...(firstIndex as number[])];
    }

    if (isNil(lastIndex)) {
        lastIndexes = [...maxIndexes];
    } else if (isFinite(lastIndex)) {
        lastIndexes = [lastIndex as number];
    } else {
        lastIndexes = [...(lastIndex as number[])];
    }

    if (isNil(startingIndex)) {
        startingIndexes = [...firstIndexes];
    } else if (isFinite(startingIndex)) {
        startingIndexes = [startingIndex as number];
    } else {
        startingIndexes = [...(startingIndex as number[])];
    }

    if (minIndexes.length < maxIndexes.length) {
        for (let counter = minIndexes.length; counter < maxIndexes.length; counter += 1) {
            minIndexes.push(0);
        }
    }

    if (minIndexes.length > maxIndexes.length) {
        throw new Error('When using multi-dimensional arrays minIndex/maxIndex/startingIndex/firstIndex/lastIndex must have the same length');
    }

    if (firstIndexes.length > minIndexes.length) {
        throw new Error('When using multi-dimensional arrays minIndex/maxIndex/startingIndex/firstIndex/lastIndex must have the same length');
    }

    if (lastIndexes.length > maxIndexes.length) {
        throw new Error('When using multi-dimensional arrays minIndex/maxIndex/startingIndex/firstIndex/lastIndex must have the same length');
    }

    if (startingIndexes.length > firstIndexes.length) {
        throw new Error('When using multi-dimensional arrays minIndex/maxIndex/startingIndex/firstIndex/lastIndex must have the same length');
    }

    const { length } = minIndexes;
    const adjMinIndexes: number[] = [];
    const adjFirstIndexes: number[] = [];
    const adjStartingIndexes: number[] = [];
    const adjLastIndexes: (number | null)[] = [];
    const adjMaxIndexes: (number | null)[] = [];

    for (let counter = 0; counter < length; counter += 1) {
        let minIndexValue = minIndexes[counter];
        const maxIndexValue = maxIndexes[counter];
        let firstIndexValue = firstIndexes[counter];
        let lastIndexValue = lastIndexes[counter];
        let startingValue = startingIndexes[counter];

        if (isNil(minIndexValue)) {
            minIndexValue = 0;
            minIndexes[counter] = minIndexValue;
        } else if (minIndexValue < 0) {
            throw new Error('minIndexes cannot be less than 0');
        }

        if (isNil(firstIndexValue)) {
            firstIndexValue = minIndexValue;
            firstIndexes[counter] = firstIndexValue;
        }

        if (isNil(startingValue)) {
            startingValue = firstIndexValue;
            startingIndexes[counter] = startingValue;
        }

        if (isNil(lastIndexValue)) {
            lastIndexValue = maxIndexValue;
            lastIndexes[counter] = lastIndexValue;
        }

        if (counter > 0 && isNil(maxIndexValue)) {
            throw new Error('Only the first index in maxIndex can be null');
        }

        adjMinIndexes[counter] = 0;
        adjMaxIndexes[counter] = !isNil(maxIndexValue) ? (maxIndexValue as number) - (minIndexValue as number) : null;
        adjFirstIndexes[counter] = (firstIndexValue as number) - (minIndexValue as number);
        adjLastIndexes[counter] = !isNil(lastIndexValue) ? (lastIndexValue as number) - (minIndexValue as number) : null;
        adjStartingIndexes[counter] = (startingValue as number) - (minIndexValue as number);
    }

    // TODO: Look to moving this logic into the loop above
    let multiplier = 1;
    const multipliers = [1];
    let minCount: number | null = adjMinIndexes[length - 1];
    let firstCount: number | null = adjFirstIndexes[length - 1];
    let startingCount: number | null = adjStartingIndexes[length - 1];
    let lastCount: number | null = adjLastIndexes[length - 1];
    let maxCount: number | null = adjMaxIndexes[length - 1];

    for (let counter = length - 2; counter >= 0; counter -= 1) {
        const maxLengthMultiplierValue = (adjMaxIndexes[counter + 1] as number) + 1;

        multiplier *= (maxLengthMultiplierValue);

        multipliers.unshift(multiplier);

        minCount = getIndexCount(minCount, adjMinIndexes[counter], multiplier);
        firstCount = getIndexCount(firstCount, adjFirstIndexes[counter], multiplier);
        startingCount = getIndexCount(startingCount, adjStartingIndexes[counter], multiplier);
        lastCount = getIndexCount(lastCount, adjLastIndexes[counter], multiplier);
        maxCount = getIndexCount(maxCount, adjMaxIndexes[counter], multiplier);
    }

    if ((minCount as number) > (firstCount as number)) {
        throw new Error('minIndex must be less than or equal to firstIndex');
    }

    if ((firstCount as number) > (startingCount as number)) {
        throw new Error('firstIndex must be less than or equal to startingIndex');
    }

    if (!isNil(lastCount)) {
        if ((startingCount as number) > lastCount) {
            throw new Error('startingIndex must be less than or equal to lastIndex');
        }

        if (!isNil(maxCount) && lastCount > maxCount) {
            throw new Error('lastIndex must be less than or equal to maxIndex');
        }
    } else if (!isNil(maxCount)) {
        if ((startingCount as number) > maxCount) {
            throw new Error('startingIndex must be less than or equal to maxIndex');
        }
    }

    return {
        minIndexes: minIndexes as number[],
        maxIndexes,
        startingIndexes: startingIndexes as number[],
        multipliers,
        firstCount: firstCount as number,
        startingCount: startingCount as number,
        lastCount,
    };
}

function calculateIndexes(count: number, multipliers: number[], minIndexes: number[]): number[] {
    let currentCount = count;
    const indexes: number[] = [];

    for (let counter = 0; counter < multipliers.length; counter += 1) {
        const mult = multipliers[counter];

        const remainder = currentCount % mult;
        indexes[counter] = (currentCount - remainder) / mult;

        currentCount = remainder;

        // This is just adjusting the value back in line with then minIndex offset.
        indexes[counter] += minIndexes[counter];
    }

    return indexes;
}

function getTopOffset(
    topOffset: number | boolean | undefined,
    listRef: React.RefObject<HTMLElement | null>,
    itemsRef: React.RefObject<HTMLElement | null>,
): number {
    if (isNumber(topOffset)) {
        return topOffset;
    }

    if (topOffset) {
        const itemsRect = itemsRef.current!.getBoundingClientRect();

        return Math.round(listRef.current!.scrollHeight - itemsRect.height);
    }

    return 0;
}

const InfiniteList = forwardRef<InfiniteListHandle, InfiniteListProps>((props, ref) => {
    const {
        id,
        className,
        Component = 'div',
        children,
        minIndex,
        maxIndex,
        firstIndex,
        lastIndex,
        startingIndex,
        onLoad,
        loadCount,
        bufferCount,
        items,
        hold = false,
        keepLoaded = false,
        onTopIndexChange,
        topOffset = 0,
        ...rest
    } = props;

    if (isNil(Component)) {
        throw new Error('The Component prop MUST be a valid type');
    }

    if (loadCount < bufferCount) {
        throw new Error('Please set loadCount to a value greater than bufferCount');
    }

    const {
        minIndexes,
        maxIndexes,
        startingIndexes,
        multipliers,
        firstCount,
        startingCount,
        lastCount,
    } = useMemo(
        () => validateIndexes(minIndex, maxIndex,
            firstIndex,
            lastIndex, startingIndex),
        [minIndex, maxIndex,
            firstIndex,
            lastIndex, startingIndex]
    );

    const scrollToRef = useRef<number | null>(null);
    const loading = useRef(false);
    const listRef = useRef<HTMLElement | null>(null);
    const itemsRef = useRef<HTMLElement | null>(null);
    const topOffsetRef = useRef(0);
    const shiftInfoRef = useRef<{ previousPosition: number; targetIndex: number } | null>(null);

    loading.current = false;

    const [data, setData] = useState<InfiniteListContextValue>({
        itemsRef,
        fromCount: startingCount,
        toCount: startingCount,
        fromIndexes: startingIndexes,
        toIndexes: startingIndexes,
        minIndexes,
        maxIndexes,
    });

    useLayoutEffect(() => {
        if (isNil(shiftInfoRef.current) || isNil(itemsRef.current)) {
            return;
        }

        const { previousPosition, targetIndex } = shiftInfoRef.current;

        const item = itemsRef.current.childNodes[targetIndex] as HTMLElement;

        if (isNil(item)) {
            throw new Error('Cannot find child to shift to.');
        }

        const itemRect = item.getBoundingClientRect();

        const scrollTop = listRef.current!.scrollTop - (previousPosition - itemRect.top);

        listRef.current!.scrollTop = scrollTop;

        shiftInfoRef.current = null;
    });

    useLayoutEffect(() => {
        topOffsetRef.current = getTopOffset(topOffset, listRef, itemsRef);

        if (isNil(scrollToRef.current) || isNil(itemsRef.current)) {
            return;
        }

        const targetChild = itemsRef.current.childNodes[scrollToRef.current - data.fromCount] as HTMLElement;

        scrollIntoView(targetChild, {
            scrollMode: 'always',
            block: 'start',
            inline: 'start',
            boundary: listRef.current!,
        });

        listRef.current!.scrollTop -= topOffsetRef.current;

        scrollToRef.current = null;
    });

    const review = useCallback(() => {
        if (loading.current || hold) {
            return;
        }

        loading.current = true;

        let { fromIndexes, toIndexes, fromCount, toCount } = data;

        if (!isNil(startingIndex) && fromCount === toCount) {
            scrollToRef.current = fromCount;
        }

        const {
            count: beforeCount,
        } = getNumberChildrenBefore(listRef.current!, itemsRef.current!, topOffsetRef.current, !isNil(onTopIndexChange));
        const afterCount = getNumberChildrenAfter(listRef.current!, itemsRef.current!);

        let loadStart = fromIndexes;
        let loadEnd = toIndexes;
        const offLoadCount = bufferCount + loadCount;

        let modified = false;

        if (afterCount < bufferCount) {
            let newCount = toCount + loadCount;

            if (!isNil(lastCount) && newCount > lastCount + 1) {
                newCount = lastCount + 1;
            }

            if (newCount !== toCount) {
                toIndexes = calculateIndexes(newCount - 1, multipliers, minIndexes);

                loadEnd = toIndexes;

                toCount = newCount;

                modified = true;
            }
        }

        if (!keepLoaded && afterCount > offLoadCount) {
            const subtractTo = afterCount - loadCount;
            let newCount = toCount - subtractTo;

            if (newCount < firstCount) {
                newCount = firstCount;
            }

            if (newCount !== toCount) {
                toIndexes = calculateIndexes(newCount - 1, multipliers, minIndexes);

                loadEnd = toIndexes;

                toCount = newCount;

                modified = true;
            }
        }

        if (beforeCount < bufferCount) {
            let newCount = fromCount - loadCount;

            if (newCount < firstCount) {
                newCount = firstCount;
            }

            if (newCount !== fromCount) {
                fromIndexes = calculateIndexes(newCount, multipliers, minIndexes);

                loadStart = fromIndexes;

                if (listRef.current!.scrollTop < 1) {
                    const item = itemsRef.current!.childNodes[0] as HTMLElement;

                    if (!isNil(item)) {
                        const itemRect = item.getBoundingClientRect();

                        shiftInfoRef.current = {
                            previousPosition: itemRect.top,
                            targetIndex: loadCount,
                        };
                    }
                }

                fromCount = newCount;

                modified = true;
            }
        }

        if (!keepLoaded && beforeCount > offLoadCount) {
            // eslint-disable-next-line operator-assignment
            const subtractFrom = beforeCount - loadCount;

            let newCount = fromCount + subtractFrom;

            if (!isNil(lastCount) && newCount > lastCount + 1) {
                newCount = lastCount + 1;
            }

            if (newCount !== fromCount) {
                fromIndexes = calculateIndexes(newCount, multipliers, minIndexes);

                loadStart = fromIndexes;

                fromCount = newCount;

                modified = true;
            }
        }

        if (!modified) {
            loading.current = false;

            return;
        }

        if (!isNil(onLoad) && fromCount < toCount) {
            onLoad(loadStart, loadEnd);
        }

        setData({
            fromIndexes,
            toIndexes,
            fromCount,
            toCount,
            itemsRef,
            minIndexes,
            maxIndexes,
        });
    }, [
        data,
        bufferCount,
        loadCount,
        onLoad,
        hold,
        keepLoaded,
        multipliers,
        firstCount,
        lastCount,
        minIndexes,
        maxIndexes,
        onTopIndexChange,
        startingIndex,
    ]);

    useEffect(review, [review]);

    const handleScroll = useThrottleCallback(
        review,
        [review],
        200,
        { leading: false }
    );

    useImperativeHandle(
        ref,
        () => ({
            gotoIndex: (gotoIndex: number | number[] | null) => {
                let targetCount = 0;
                let targetIndexes = gotoIndex;

                if (isNil(targetIndexes)) {
                    targetIndexes = [0];
                } else if (isFinite(targetIndexes)) {
                    targetIndexes = [targetIndexes as number];
                } else {
                    targetIndexes = [...(targetIndexes as number[])];
                }

                if ((targetIndexes as number[]).length !== maxIndexes.length) {
                    throw new Error('gotoIndex must have same length as maxIndex');
                }

                for (let counter = 0; counter < (targetIndexes as number[]).length; counter += 1) {
                    const mult = multipliers[counter];
                    const minIndexValue = minIndexes[counter];
                    const targetIndexValue = (targetIndexes as number[])[counter];

                    if (isNil(targetIndexValue)) {
                        throw new Error('gotoIndex values cannot be nil.');
                    }

                    const adjustedTargetIndexValue = targetIndexValue - minIndexValue;

                    const countPart = getIndexCount(targetCount, adjustedTargetIndexValue, mult);

                    targetCount += (countPart as number) * mult;
                }

                if (targetCount < firstCount) {
                    throw new Error('gotoIndex must be greater than or equal to firstIndex. If firstIndex has not been provided then it is calculated off of minIndex.');
                }

                if (!isNil(lastCount) && targetCount > lastCount) {
                    throw new Error('gotoIndex must be less than or equal to lastIndex. If lastIndex has not been provided then it is calculated off of maxIndex.');
                }

                setData({
                    fromIndexes: targetIndexes as number[],
                    toIndexes: targetIndexes as number[],
                    fromCount: targetCount,
                    toCount: targetCount,
                    itemsRef,
                    minIndexes,
                    maxIndexes,
                });
		    },
        }),
        [
            multipliers,
            minIndexes,
            maxIndexes,
            firstCount,
            lastCount,
        ]
    );

    return (
        <Component
            {...rest}
            ref={listRef}
            id={id}
            className={classnames('ra-infinite-list', className)}
            onScroll={handleScroll}
        >
            <InfiniteListContext.Provider value={data}>
                {children}
            </InfiniteListContext.Provider>
        </Component>
    );
});

InfiniteList.displayName = 'InfiniteList';

export default InfiniteList;
