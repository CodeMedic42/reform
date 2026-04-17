import React from 'react';
import classnames from 'classnames';
import { isNil, isString, forEach, isEmpty } from 'lodash-es';

/* eslint-disable react/jsx-props-no-spreading */
function buildGutterClassName(acc, gutter, additionalPrefix, suffix) {
    if (isEmpty(gutter)) {
        return;
    }
    if (!isEmpty(additionalPrefix)) {
        acc.classNames.push(`gutter${additionalPrefix}${suffix}`);
        acc.styles[`--layout-row-gutter${additionalPrefix}${suffix}`] = `${gutter}px`;
    }
    else {
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
    }
    else {
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
    buildGutterClassGroup(states, gutter, '');
    return states;
}
function Container(props) {
    const { className, gutter, children, hideOverflow, style, ...rest } = props;
    const { classNames: gutterClasses, styles: gutterStyles, } = buildGutterClasses(gutter);
    const classNames = classnames('layout-container', buildGutterClasses(gutter), className, gutterClasses, {
        'hide-overflow': hideOverflow,
    });
    return (React.createElement("div", { ...rest, style: {
            ...style,
            ...gutterStyles,
        }, className: classNames }, children));
}
Container.defaultProps = {
    className: null,
    gutter: null,
    hideOverflow: null,
    children: null,
    style: null,
};

export { Container as default };
