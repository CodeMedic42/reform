import React from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import startsWith from 'lodash/startsWith';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import Row from './row';

type StaticType = `static:${number}`;
type JustifyType = null | 'left' | 'center' | 'right';
type AlignType = null | 'top' | 'center' | 'bottom';
type ColumnType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type WidthType = null | 'fill' | 'content' | ColumnType | StaticType;
type OffsetType = null | 'fill' | ColumnType | StaticType;
type BaseWidthType = null | StaticType;
type OrderType = null | `${number}`;

export interface ColumnProps {
    className?: string,
    justify?: (JustifyType | JustifyType[]),
    align?: (AlignType | AlignType[]),
    width?: (WidthType | WidthType[])
    minWidth?: (BaseWidthType | BaseWidthType[]),
    maxWidth?: (BaseWidthType | BaseWidthType[]),
    paddingTop?: (BaseWidthType | BaseWidthType[]),
    leftOffset?: (OffsetType | OffsetType[]),
    rightOffset?: (OffsetType | OffsetType[]),
    order?: OrderType | OrderType[],
    useContentBox?: boolean,
    style?: object,
    children?: JSX.Element | JSX.Element[],
}

interface classStates {
    classNames: string[],
    styles: {
      [index: string]: string;
    },
}

function buildClass(prop: string | string[], prefix: string): null | string {
    if (isNil(prop)) {
        return null;
    }

    if (isString(prop)) {
        return `${prefix}-${prop}`;
    }

    const classNames: {
        [key: string]: boolean,
    } = {};

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

function applySequenceOrderState(acc: classStates, value: string, suffix: string): void {
    if (isNil(value)) {
        return;
    }

    acc.classNames.push(`sequence-order${suffix}`);
    acc.styles[`--layout-col-order${suffix}`] = value;
}

function applyWidthState(acc: classStates, value: string, suffix: string): void {
    if (isNil(value)) {
        return;
    }

    if (!startsWith(value, 'static')) {
        acc.classNames.push(`width-${value}${suffix}`);
    } else {
        const widthSize = value.slice(7);

        acc.classNames.push(`width-static${suffix}`);
        acc.styles[`--layout-col-static${suffix}`] = `${widthSize}px`;
    }
}

function applyWidthLimitState(
    acc: classStates,
    value: string,
    suffix: string,
    limitType: string,
): void {
    if (isNil(value)) {
        return;
    }

    if (!startsWith(value, 'static')) {
        throw new Error(
            'Width limits do not support anything other than static at the moment',
        );
    }

    acc.classNames.push(`${limitType}-width-static${suffix}`);
    acc.styles[
        `--layout-col-${limitType}-width-static${suffix}`
    ] = `${value.slice(7)}px`;
}

function applyPaddingTopState(acc: classStates, value: string, suffix: string): void {
    if (isNil(value)) {
        return;
    }

    if (!startsWith(value, 'static')) {
        throw new Error(
            'Padding Top does not support anything other than static at the moment',
        );
    }

    acc.classNames.push(`padding-top-static${suffix}`);
    acc.styles[`--layout-col-padding-top-static${suffix}`] = `${value.slice(
        7,
    )}px`;
}

type classFunction = (acc: classStates, value: string, suffix: string, ...args: string[]) => void;

function buildClassState(
    value: string | string[],
    cb: classFunction,
    ...args: string[]
): classStates {
    const states = {
        classNames: [],
        styles: {},
    };

    if (!isNil(value)) {
        if (isString(value)) {
            cb(states, value, '', ...args);
        } else {
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

function Column(props: ColumnProps) {
    const {
        className = null,
        justify,
        align,
        width,
        minWidth,
        maxWidth,
        paddingTop,
        leftOffset,
        rightOffset,
        order,
        useContentBox,
        children,
        style = {},
        ...rest
    } = props;

    const {
        classNames: widthClasses,
        styles: widthStyles,
    } = buildClassState(width as string, applyWidthState);
    const {
        classNames: orderClasses,
        styles: orderStyles,
    } = buildClassState(order as string, applySequenceOrderState);
    const {
        classNames: minWidthClasses,
        styles: minWidthStyles,
    } = buildClassState(minWidth as string, applyWidthLimitState, 'min');
    const {
        classNames: maxWidthClasses,
        styles: maxWidthStyles,
    } = buildClassState(maxWidth as string, applyWidthLimitState, 'max');
    const {
        classNames: paddingTopClasses,
        styles: paddingTopStyles,
    } = buildClassState(paddingTop as string, applyPaddingTopState);

    const type = isArray(children)
        ? (children as JSX.Element[])[0]?.type
        : (children as JSX.Element)?.type;

    const classNames = classnames(
        'layout-col',
        buildClass(justify as string, 'justify'),
        buildClass(align as string, 'align'),
        buildClass(leftOffset as string, 'offset-left'),
        buildClass(rightOffset as string, 'offset-right'),
        className,
        ...widthClasses,
        ...orderClasses,
        ...minWidthClasses,
        ...maxWidthClasses,
        ...paddingTopClasses,
        {
            'row-column': type === Row,
            'use-content-box': useContentBox,
        },
    );

    return (
        <div
            {...rest}
            className={classNames}
            style={{
                ...style,
                ...widthStyles,
                ...orderStyles,
                ...minWidthStyles,
                ...maxWidthStyles,
                ...paddingTopStyles,
            }}
        >
            {children}
        </div>
    );
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

export default Column;
