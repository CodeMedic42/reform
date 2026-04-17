import React, { useContext, Fragment } from 'react';
import classnames from 'classnames';
import { get, isNil } from 'lodash-es';
import InfiniteListContext from './infinite-list-context.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

function load(collection, context, cb) {
    const { minIndexes, maxIndexes, fromIndexes, fromCount, toCount, } = context;
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
            }
            else {
                currentIndexes[index] += 1;
                if (!isNil(maxIndexes[index]) && currentIndexes[index] > maxIndexes[index]) {
                    currentIndexes[index] = minIndexes[index];
                    index -= 1;
                }
                else {
                    done = true;
                }
            }
        }
    }
    return arr;
}
function InfiniteListItems(props) {
    const { className, items, render, Component, ...rest } = props;
    const context = useContext(InfiniteListContext);
    const { itemsRef } = context;
    return (React.createElement(Component, { ref: itemsRef, className: classnames('ra-infinite-list-items', className), ...rest }, load(items, context, (item, index, count) => (React.createElement(Fragment, { key: count }, render(item, index))))));
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

export { InfiniteListItems as default };
