/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import isPlainObject from 'lodash/isPlainObject';

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

function buildGutterClassName(
    acc,
    gutter,
    additionalPrefix,
    suffix,
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

function buildGutterClassGroup(acc, gutter, additionalPrefix) {
    if (isNil(gutter)) {
        return;
    }

    if (isString(gutter)) {
        buildGutterClassName(acc, gutter, additionalPrefix, '');
    } else {
        forEach(gutter, (valueItem, index) => {
            let size = '';

            if (index > 0) {
                size = `-${index}`;
            }

            buildGutterClassName(acc, valueItem, additionalPrefix, size);
        });
    }
}

function buildGutterClasses(gutter) {
    const states = {
        classNames: [],
        styles: {},
    };

    if (isNil(gutter)) {
        return states;
    }

    if (isPlainObject(gutter)) {
        const { h: hGutter, v: vGutter } = gutter;

        buildGutterClassGroup(states, hGutter, '-h');
        buildGutterClassGroup(states, vGutter, '-v');
    } else {
        buildGutterClassGroup(states, gutter, '');
    }

    return states;
}

function Row(props, ref) {
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
        buildClass(justify, 'justify'),
        buildClass(align, 'align'),
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
