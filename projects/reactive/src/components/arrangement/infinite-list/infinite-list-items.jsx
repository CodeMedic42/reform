import React, { Fragment, useContext } from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import InfiniteListContext from './infinite-list-context';
import PropTypes from '../../../common/prop-types';

function load(collection, context, cb) {
    const {
        minIndexes,
        maxIndexes,
        fromIndexes,
        fromCount,
        toCount,
    } = context;

    const arr = [];
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

                if (!isNil(maxIndexes[index]) && currentIndexes[index] > maxIndexes[index]) {
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

function InfiniteListItems(props) {
    const {
        className,
        items,
        render,
        Component,
        ...rest
    } = props;

    const context = useContext(InfiniteListContext);

    const { itemsRef } = context;

    return (
        <Component ref={itemsRef} className={classnames('ra-infinite-list-items', className)} {...rest}>
            {load(items, context, (item, index, count) => (
                <Fragment key={count}>
                    {render(item, index)}
                </Fragment>
            ))}
        </Component>
    );
}

InfiniteListItems.propTypes = {
    className: PropTypes.string,
    Component: PropTypes.Component,
    items: PropTypes.arrayOf(PropTypes.any),
    render: PropTypes.func.isRequired,
};

InfiniteListItems.defaultProps = {
    className: null,
    items: null,
    Component: 'div',
};

export default InfiniteListItems;