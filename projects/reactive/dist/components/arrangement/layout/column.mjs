import React from 'react';
import classnames from 'classnames';
import { isArray, isNil, isString, forEach, startsWith } from 'lodash-es';
import Row from './row.mjs';

function buildClass(prop, prefix) {
    if (isNil(prop)) {
        return null;
    }
    if (isString(prop)) {
        return `${prefix}-${prop}`;
    }
    const classNames = {};
    forEach(prop, (value, index) => {
        let size = '';
        if (index > 0) {
            size = `-${index}`;
        }
        classNames[`${prefix}-${value}${size}`] = !isNil(value);
        return classNames;
    });
    return classnames(classNames);
}
function applySequenceOrderState(acc, value, suffix) {
    if (isNil(value)) {
        return;
    }
    acc.classNames.push(`sequence-order${suffix}`);
    acc.styles[`--layout-col-order${suffix}`] = value;
}
function applyWidthState(acc, value, suffix) {
    if (isNil(value)) {
        return;
    }
    if (!startsWith(value, 'static')) {
        acc.classNames.push(`width-${value}${suffix}`);
    }
    else {
        const widthSize = value.slice(7);
        acc.classNames.push(`width-static${suffix}`);
        acc.styles[`--layout-col-static${suffix}`] = `${widthSize}px`;
    }
}
function applyWidthLimitState(acc, value, suffix, limitType) {
    if (isNil(value)) {
        return;
    }
    if (!startsWith(value, 'static')) {
        throw new Error('Width limits do not support anything other than static at the moment');
    }
    acc.classNames.push(`${limitType}-width-static${suffix}`);
    acc.styles[`--layout-col-${limitType}-width-static${suffix}`] = `${value.slice(7)}px`;
}
function applyPaddingTopState(acc, value, suffix) {
    if (isNil(value)) {
        return;
    }
    if (!startsWith(value, 'static')) {
        throw new Error('Padding Top does not support anything other than static at the moment');
    }
    acc.classNames.push(`padding-top-static${suffix}`);
    acc.styles[`--layout-col-padding-top-static${suffix}`] = `${value.slice(7)}px`;
}
function buildClassState(value, cb, ...args) {
    const states = {
        classNames: [],
        styles: {},
    };
    if (!isNil(value)) {
        if (isString(value)) {
            cb(states, value, '', ...args);
        }
        else {
            forEach(value, (valueItem, index) => {
                let size = '';
                if (index > 0) {
                    size = `-${index}`;
                }
                cb(states, valueItem, size, ...args);
            });
        }
    }
    return states;
}
function Column(props) {
    const { className = null, justify, align, width, minWidth, maxWidth, paddingTop, leftOffset, rightOffset, order, useContentBox, children, style = {}, ...rest } = props;
    const { classNames: widthClasses, styles: widthStyles, } = buildClassState(width, applyWidthState);
    const { classNames: orderClasses, styles: orderStyles, } = buildClassState(order, applySequenceOrderState);
    const { classNames: minWidthClasses, styles: minWidthStyles, } = buildClassState(minWidth, applyWidthLimitState, 'min');
    const { classNames: maxWidthClasses, styles: maxWidthStyles, } = buildClassState(maxWidth, applyWidthLimitState, 'max');
    const { classNames: paddingTopClasses, styles: paddingTopStyles, } = buildClassState(paddingTop, applyPaddingTopState);
    const type = isArray(children)
        ? children[0]?.type
        : children?.type;
    const classNames = classnames('layout-col', buildClass(justify, 'justify'), buildClass(align, 'align'), buildClass(leftOffset, 'offset-left'), buildClass(rightOffset, 'offset-right'), className, ...widthClasses, ...orderClasses, ...minWidthClasses, ...maxWidthClasses, ...paddingTopClasses, {
        'row-column': type === Row,
        'use-content-box': useContentBox,
    });
    return (React.createElement("div", { ...rest, className: classNames, style: {
            ...style,
            ...widthStyles,
            ...orderStyles,
            ...minWidthStyles,
            ...maxWidthStyles,
            ...paddingTopStyles,
        } }, children));
}
Column.defaultProps = {
    className: null,
    justify: null,
    align: null,
    width: null,
    minWidth: null,
    maxWidth: null,
    paddingTop: null,
    leftOffset: null,
    rightOffset: null,
    order: null,
    useContentBox: null,
    style: null,
    children: null,
};

export { Column as default };
