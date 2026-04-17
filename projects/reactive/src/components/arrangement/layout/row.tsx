/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { isNil, isString, isEmpty, forEach, isPlainObject } from 'lodash-es';

type GutterValueType = string;
type GutterType = GutterValueType | GutterValueType[];
type GutterObjectType = { h?: GutterType; v?: GutterType };
type GutterProp = GutterType | GutterObjectType;

export interface RowProps {
    className?: string | null;
    justify?: string | string[] | null;
    align?: string | string[] | null;
    gutter?: GutterProp | null;
    enableBefore?: boolean | null;
    enableAfter?: boolean | null;
    children?: React.ReactNode;
    before?: string | null;
    after?: string | null;
    style?: Record<string, string | number | boolean | null | undefined>;
    [key: string]: unknown;
}

interface ClassStates {
    classNames: string[];
    styles: Record<string, string>;
}

function buildClass(prop: string | string[] | null | undefined, prefix: string): null | string {
    if (isNil(prop)) {
        return null;
    }

    if (isString(prop)) {
        return `${prefix}-${prop}`;
    }

    const classNames: Record<string, boolean> = {};

    forEach(prop, (value: string, index: number) => {
        let size = '';

        if (index > 0) {
            size = `-${index}`;
        }

        classNames[`${prefix}-${value}${size}`] = !isNil(value);

        return classNames;
    });

    return classnames(classNames);
}

function buildGutterClassName(
    acc: ClassStates,
    gutter: GutterValueType | undefined,
    additionalPrefix: string,
    suffix: string,
): void {
    if (isEmpty(gutter)) {
        return;
    }

    if (!isEmpty(additionalPrefix)) {
        acc.classNames.push(`gutter${additionalPrefix}${suffix}`);
        acc.styles[`--layout-row-gutter${additionalPrefix}${suffix}`] = `${gutter}px`;
    } else {
        acc.classNames.push(`gutter${suffix}`);
        acc.styles[`--layout-row-gutter-v${suffix}`] = `${gutter}px`;
        acc.styles[`--layout-row-gutter-h${suffix}`] = `${gutter}px`;
    }
}

function buildGutterClassGroup(acc: ClassStates, gutter: GutterType | undefined, additionalPrefix: string): void {
    if (isNil(gutter)) {
        return;
    }

    if (isString(gutter)) {
        buildGutterClassName(acc, gutter, additionalPrefix, '');
    } else {
        forEach(gutter as GutterValueType[], (valueItem: GutterValueType, index: number) => {
            let size = '';

            if (index > 0) {
                size = `-${index}`;
            }

            buildGutterClassName(acc, valueItem, additionalPrefix, size);
        });
    }
}

function buildGutterClasses(gutter: GutterProp | null | undefined): ClassStates {
    const states: ClassStates = {
        classNames: [],
        styles: {},
    };

    if (isNil(gutter)) {
        return states;
    }

    if (isPlainObject(gutter)) {
        const { h: hGutter, v: vGutter } = gutter as GutterObjectType;

        buildGutterClassGroup(states, hGutter, '-h');
        buildGutterClassGroup(states, vGutter, '-v');
    } else {
        buildGutterClassGroup(states, gutter as GutterType, '');
    }

    return states;
}

function Row(props: RowProps, ref: React.Ref<HTMLDivElement>): React.ReactElement {
    const {
        className,
        justify,
        align,
        gutter,
        enableBefore,
        enableAfter,
        children,
        before,
        after,
        style = {},
        ...rest
    } = props;

    const beforeFinal = enableBefore === true && isNil(before) ? 'on' : before;
    const afterFinal = enableAfter === true && isNil(after) ? 'on' : after;

    const {
        classNames: gutterClasses,
        styles: gutterStyles,
    } = buildGutterClasses(gutter);

    const classNames = classnames(
        'layout-row',
        buildClass(justify as string, 'justify'),
        buildClass(align as string, 'align'),
        buildClass(beforeFinal, 'before'),
        buildClass(afterFinal, 'after'),
        gutterClasses,
        className,
    );

    return (
        <div
            {...rest}
            ref={ref}
            className={classNames}
            style={{
                ...style,
                ...gutterStyles,
            }}
        >
            {children}
        </div>
    );
}

export default forwardRef(Row);
