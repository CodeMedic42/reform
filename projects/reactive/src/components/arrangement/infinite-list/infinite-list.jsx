import React, { useLayoutEffect, forwardRef, useImperativeHandle, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import scrollIntoView from 'scroll-into-view-if-needed';
import isFinite from 'lodash/isFinite';
import PropTypes from '../../../common/prop-types';
import useThrottleCallback from '../../../hooks/use-throttle-callback';
import InfiniteListContext from './infinite-list-context';

function getNumberChildrenBefore(parent, itemsContainer, topOffset, getTopIndex) {
    let count = 0;
    let visibleIndex = null;

    if (itemsContainer.childNodes.length > 0) {
        const parentRect = parent.getBoundingClientRect();

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const child = itemsContainer.childNodes[count];
            const childRect = child.getBoundingClientRect();

            if (childRect.bottom < (parentRect.top + topOffset)) {
                count += 1;
            } else {
                break;
            }
        }

        if (getTopIndex) {
            const firstVisible = count;
            const visible = itemsContainer.childNodes[firstVisible];

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

function getNumberChildrenAfter(parent, itemsContainer) {
    if (itemsContainer.childNodes.length <= 0) {
        return 0;
    }

    let count = itemsContainer.childNodes.length;

    const parentRect = parent.getBoundingClientRect();

    // eslint-disable-next-line no-constant-condition
    while (count > 0) {
        const child = itemsContainer.childNodes[count - 1];
        const childRect = child.getBoundingClientRect();

        if (childRect.top > parentRect.bottom) {
            count -= 1;
        } else {
            break;
        }
    }

    return itemsContainer.childNodes.length - count;
}

function getIndexCount(count, value, multiplier) {
    if (isNil(count) || isNil(value)) {
        return null;
    }

    return (value * multiplier) + count;
};

function validateIndexes(minIndex, maxIndex,
    firstIndex,
    lastIndex, startingIndex) {
    let minIndexes = null;
    let maxIndexes = null;
    let firstIndexes = null;
    let lastIndexes = null;
    let startingIndexes = null;

    if (isNil(minIndex)) {
        minIndexes = [0];
    } else if (isFinite(minIndex)) {
        minIndexes = [minIndex];
    } else {
        minIndexes = [...minIndex];
    };

    if (isNil(maxIndex)) {
        maxIndexes = [null];
    } else if (isFinite(maxIndex)) {
        maxIndexes = [maxIndex];
    } else {
        maxIndexes = [...maxIndex];
    };

    if (isNil(firstIndex)) {
        firstIndexes = [...minIndexes];
    } else if (isFinite(firstIndex)) {
        firstIndexes = [firstIndex];
    } else {
        firstIndexes = [...firstIndex];
    };

    if (isNil(lastIndex)) {
        lastIndexes = [...maxIndexes];
    } else if (isFinite(lastIndex)) {
        lastIndexes = [lastIndex];
    } else {
        lastIndexes = [...lastIndex];
    };

    if (isNil(startingIndex)) {
        startingIndexes = [...firstIndexes];
    } else if (isFinite(startingIndex)) {
        startingIndexes = [startingIndex];
    } else {
        startingIndexes = [...startingIndex];
    };

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
    const adjMinIndexes = [];
    const adjFirstIndexes = [];
    const adjStartingIndexes = [];
    const adjLastIndexes = [];
    const adjMaxIndexes = [];

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
        adjMaxIndexes[counter] = !isNil(maxIndexValue) ? maxIndexValue - minIndexValue : null;
        adjFirstIndexes[counter] = firstIndexValue - minIndexValue;
        adjLastIndexes[counter] = !isNil(lastIndexValue) ? lastIndexValue - minIndexValue : null;
        adjStartingIndexes[counter] = startingValue - minIndexValue;
    }

    // TODO: Look to moving this logic into the loop above
    let multiplier = 1;
    const multipliers = [1];
    let minCount = adjMinIndexes[length - 1];
    let firstCount = adjFirstIndexes[length - 1];
    let startingCount = adjStartingIndexes[length - 1];
    let lastCount = adjLastIndexes[length - 1];
    let maxCount = adjMaxIndexes[length - 1];

    for (let counter = length - 2; counter >= 0; counter -= 1) {
        const maxLengthMultiplierValue = adjMaxIndexes[counter + 1] + 1;

        multiplier *= (maxLengthMultiplierValue);

        multipliers.unshift(multiplier);

        minCount = getIndexCount(minCount, adjMinIndexes[counter], multiplier);
        firstCount = getIndexCount(firstCount, adjFirstIndexes[counter], multiplier);
        startingCount = getIndexCount(startingCount, adjStartingIndexes[counter], multiplier);
        lastCount = getIndexCount(lastCount, adjLastIndexes[counter], multiplier);
        maxCount = getIndexCount(maxCount, adjMaxIndexes[counter], multiplier);
    }

    if (minCount > firstCount) {
        throw new Error('minIndex must be less than or equal to firstIndex');
    }

    if (firstCount > startingCount) {
        throw new Error('firstIndex must be less than or equal to startingIndex');
    }

    if (!isNil(lastCount)) {
        if (startingCount > lastCount) {
            throw new Error('startingIndex must be less than or equal to lastIndex');
        }

        if (!isNil(maxCount) && lastCount > maxCount) {
            throw new Error('lastIndex must be less than or equal to maxIndex');
        }
    } else if (!isNil(maxCount)) {
        if (startingCount > maxCount) {
            throw new Error('startingIndex must be less than or equal to maxIndex');
        }
    }

    return {
        minIndexes,
        maxIndexes,
        startingIndexes,
        multipliers,
        firstCount,
        startingCount,
        lastCount,
    };
}

function calculateIndexes(count, multipliers, minIndexes) {
    let currentCount = count;
    const indexes = [];

    for (let counter = 0; counter < multipliers.length; counter += 1) {
        const multiplier = multipliers[counter];

        const remainder = currentCount % multiplier;
        indexes[counter] = (currentCount - remainder) / multiplier;

        currentCount = remainder;

        // This is just adjusting the value back in line with then minIndex offset.
        indexes[counter] += minIndexes[counter];
    }

    return indexes;
}

function getTopOffset(topOffset, listRef, itemsRef) {
    if (isNumber(topOffset)) {
        return topOffset;
    }

    if (topOffset) {
        const itemsRect = itemsRef.current.getBoundingClientRect();

        return Math.round(listRef.current.scrollHeight - itemsRect.height);
    }

    return 0;
}

const InfiniteList = forwardRef((props, ref) => {
    const {
        id,
        className,
        Component,
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
        hold,
        keepLoaded,
        onTopIndexChange,
        topOffset,
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

    const scrollToRef = useRef(null);
    const loading = useRef(false);
    const listRef = useRef();
    const itemsRef = useRef();
    const topOffsetRef = useRef(0);
    const shiftInfoRef = useRef(null);

    loading.current = false;

    const [data, setData] = useState({
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

        const item = itemsRef.current.childNodes[targetIndex];

        if (isNil(item)) {
            throw new Error('Cannot find child to shift to.');
        }

        // const listRect = listRef.current.getBoundingClientRect();

        const itemRect = item.getBoundingClientRect();

        // const difference = listRect.top - itemRect.top;

        const scrollTop = listRef.current.scrollTop - (previousPosition - itemRect.top);

        listRef.current.scrollTop = scrollTop;

        shiftInfoRef.current = null;
    });

    useLayoutEffect(() => {
        topOffsetRef.current = getTopOffset(topOffset, listRef, itemsRef);

        if (isNil(scrollToRef.current) || isNil(itemsRef.current)) {
            return;
        }

        const targetChild = itemsRef.current.childNodes[scrollToRef.current - data.fromCount];

        scrollIntoView(targetChild, {
            scrollMode: 'always',
            block: 'start',
            inline: 'start',
            boundary: listRef.current,
        });

        listRef.current.scrollTop -= topOffsetRef.current;

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
        } = getNumberChildrenBefore(listRef.current, itemsRef.current, topOffsetRef.current, !isNil(onTopIndexChange));
        const afterCount = getNumberChildrenAfter(listRef.current, itemsRef.current);

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

                // There is a weird behavior of all browsers on all OS's.
                // When adding items to the top of an element which is or is inside of a scroll container,
                // the scroll container will behave differently from when its scrollTop value is 0 versus
                // when that value is not 0.
                //   When it is not zero, the scroll container will shift the scroll bar to keep the position
                // of all elements currently rendered. This has the affect to the user that nothing is
                // shifting and the only visible sign something is happening is the scroll bar is shrinking
                // due to there being more items in the scroll container.
                // and it will move down as well.
                //   When it is zero, the scroll bar will stay at zero and the user will see all the new
                // items being added and all the existing items shifting down. This is NOT the effect we
                // want and there does not seem to be any easy way to adjust the functionality. The only
                // thing we can do is revert the scroll position ourselves.
                //   Lame
                if (listRef.current.scrollTop < 1) {
                    // We are adding items in this case so we want
                    // to know the current position of the first child.
                    const item = itemsRef.current.childNodes[0];

                    if (!isNil(item)) {
                        const itemRect = item.getBoundingClientRect();

                        shiftInfoRef.current = {
                            // We will use the current top position and later the new one after the render.
                            previousPosition: itemRect.top,
                            // This will be its new position in the list of rendered children.
                            // We could assume this later when we use it but for now I'll leave this here.
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
            gotoIndex: (gotoIndex) => {
                let targetCount = 0;
                let targetIndexes = gotoIndex;

                if (isNil(targetIndexes)) {
                    targetIndexes = [0];
                } else if (isFinite(targetIndexes)) {
                    targetIndexes = [targetIndexes];
                } else {
                    targetIndexes = [...targetIndexes];
                }

                if (targetIndexes.length !== maxIndexes.length) {
                    throw new Error('gotoIndex must have same length as maxIndex');
                }

                for (let counter = 0; counter < targetIndexes.length; counter += 1) {
                    const multiplier = multipliers[counter];
                    const minIndexValue = minIndexes[counter];
                    const targetIndexValue = targetIndexes[counter];

                    if (isNil(targetIndexValue)) {
                        throw new Error('gotoIndex values cannot be nil.');
                    }

                    const adjustedTargetIndexValue = targetIndexValue - minIndexValue;

                    const countPart = getIndexCount(targetCount, adjustedTargetIndexValue, multiplier);

                    targetCount += (countPart * multiplier);
                }

                if (targetCount < firstCount) {
                    throw new Error('gotoIndex must be greater than or equal to firstIndex. If firstIndex has not been provided then it is calculated off of minIndex.');
                }

                if (!isNil(lastCount) && targetCount > lastCount) {
                    throw new Error('gotoIndex must be less than or equal to lastIndex. If lastIndex has not been provided then it is calculated off of maxIndex.');
                }

                setData({
                    fromIndexes: targetIndexes,
                    toIndexes: targetIndexes,
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

const countingPropType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(
        PropTypes.number,
    ),
]);

InfiniteList.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    Component: PropTypes.Component,
    children: PropTypes.children,
    firstIndex: countingPropType,
    lastIndex: countingPropType,
    minIndex: countingPropType,
    maxIndex: countingPropType,
    startingIndex: countingPropType,
    onLoad: PropTypes.func,
    loadCount: PropTypes.number.isRequired,
    bufferCount: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.any),
    hold: PropTypes.bool,
    keepLoaded: PropTypes.bool,
    onTopIndexChange: PropTypes.func,
    topOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

InfiniteList.defaultProps = {
    id: null,
    className: null,
    Component: 'div',
    children: null,
    firstIndex: null,
    lastIndex: null,
    minIndex: null,
    maxIndex: null,
    startingIndex: null,
    items: null,
    hold: false,
    keepLoaded: false,
    onLoad: null,
    onTopIndexChange: null,
    topOffset: 0,
};

export default InfiniteList;