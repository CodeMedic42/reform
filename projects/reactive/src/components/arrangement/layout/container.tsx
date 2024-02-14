/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';

type GutterValueType = string;
type gutterType = GutterValueType | GutterValueType[];

export interface ContainerProps {
    className?: string,
    gutter?: gutterType,
    hideOverflow?: boolean,
    children?: JSX.Element | JSX.Element[],
    style?: {
        [key: string]: string | number | boolean | null | undefined,
    }
}

interface AccInt {
    classNames: string[],
    styles: {
        [key: string]: string,
    }
}

function buildGutterClassName(
    acc: AccInt,
    gutter?: gutterType,
    additionalPrefix?: string,
    suffix?: string,
) {
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

function buildGutterClassGroup(acc: AccInt, gutter?: gutterType, additionalPrefix?: string) {
    if (isNil(gutter)) {
        return;
    }

    if (isString(gutter)) {
        buildGutterClassName(acc, gutter, additionalPrefix, '');
    } else {
        forEach(gutter as GutterValueType[], (valueItem, index) => {
            let size = '';

            if (index > 0) {
                size = `-${index}`;
            }

            buildGutterClassName(acc, valueItem, additionalPrefix, size);
        });
    }
}

function buildGutterClasses(gutter?: gutterType) {
    const states = {
        classNames: [],
        styles: {},
    };

    if (isNil(gutter)) {
        return states;
    }

    buildGutterClassGroup(states, gutter, '');

    return states;
}

function Container(props: ContainerProps) {
    const {
        className, gutter, children, hideOverflow, style, ...rest
    } = props;

    const {
        classNames: gutterClasses,
        styles: gutterStyles,
    } = buildGutterClasses(gutter);

    const classNames = classnames(
        'layout-container',
        buildGutterClasses(gutter),
        className,
        gutterClasses,
        {
            'hide-overflow': hideOverflow,
        },
    );

    return (
        <div
            {...rest}
            style={{
                ...style,
                ...gutterStyles,
            }}
            className={classNames}
        >
            {children}
        </div>
    );
}

export default Container;
