import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import isNil from 'lodash/isNil';

export const schemeColorOrder = [
    'primary',
    'secondary',
    'info',
    'success',
    'warn',
    'danger',
];

export const paletteColorOrder = [
    'purple',
    'navy',
    'blue',
    'cyan',
    'green',
    'yellow',
    'orange',
    'red',
    'grey',
];

export const paletteShades = [
    'darkest',
    'darker',
    'dark',
    'light',
    'lighter',
    'lightest',
];

export const colorOrder = [...schemeColorOrder, ...paletteColorOrder];

export const functionalColorLevels = reduce(
    schemeColorOrder,
    (acc, color, index) => {
        acc[color] = index;

        return acc;
    },
    {},
);

export const paletteColorLevels = reduce(
    paletteColorOrder,
    (acc, color, index) => {
        acc[color] = index;

        return acc;
    },
    {},
);

export function getSchemeColorClasses({
    colorRequired = true,
    color,
    enableBorder,
    design,
    borderWidth,
}) {
    if (isNil(color) && colorRequired) {
        return '';
    }

    let classes = 'ra-clr-int';
    classes = !isNil(color) ? `${classes} ra-clr-int-${color}` : classes;
    classes = !isNil(design) ? `${classes} ra-clr-int-${design}` : classes;
    classes = enableBorder ? `${classes} sch-br` : classes;
    classes = !isNil(borderWidth)
        ? `${classes} border-${borderWidth}`
        : classes;

    return classes;
}

export function getPaletteColorClasses({
    colorRequired = true,
    color,
    enableBorder,
    enableBackground,
    shade,
    borderWidth,
}) {
    if (isNil(color) && colorRequired) {
        return '';
    }

    let classes = 'ra-palette';
    classes = !isNil(color) ? `${classes} plt-${color}` : classes;
    classes = !isNil(shade) ? `${classes} plt-${shade}` : classes;
    classes = enableBorder ? `${classes} plt-br` : classes;
    classes = enableBackground ? `${classes} plt-bg` : classes;
    classes = !isNil(borderWidth)
        ? `${classes} border-${borderWidth}`
        : classes;

    return classes;
}

export const getColorInfo = (options) => {
    const { colorRequired = true, color } = options;

    let colorClasses = '';
    let isSchemeColor = false;

    if (!isNil(color)) {
        const schemeColor = find(
            schemeColorOrder,
            (functionalColor) => functionalColor === color,
        );

        if (isNil(schemeColor)) {
            colorClasses = getPaletteColorClasses(options);
        } else {
            colorClasses = getSchemeColorClasses(options);
            isSchemeColor = true;
        }
    } else if (!colorRequired) {
        colorClasses = getSchemeColorClasses(options);
        isSchemeColor = true;
    }

    return { colorClasses, isSchemeColor };
};

export const schemeColorPropType = PropTypes.oneOf(schemeColorOrder);
export const paletteColorPropType = PropTypes.oneOf(paletteColorOrder);
export const colorPropType = PropTypes.oneOf(colorOrder);
export const shadePropType = PropTypes.oneOf(paletteShades);
