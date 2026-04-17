import PropTypes from 'prop-types';
import { reduce, isNil, find } from 'lodash-es';

const schemeColorOrder = [
    'primary',
    'secondary',
    'info',
    'success',
    'warn',
    'danger',
];
const paletteColorOrder = [
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
const paletteShades = [
    'darkest',
    'darker',
    'dark',
    'light',
    'lighter',
    'lightest',
];
const colorOrder = [...schemeColorOrder, ...paletteColorOrder];
reduce(schemeColorOrder, (acc, color, index) => {
    acc[color] = index;
    return acc;
}, {});
reduce(paletteColorOrder, (acc, color, index) => {
    acc[color] = index;
    return acc;
}, {});
function getSchemeColorClasses({ colorRequired = true, color, enableBorder, design, borderWidth, }) {
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
function getPaletteColorClasses({ colorRequired = true, color, enableBorder, enableBackground, shade, borderWidth, }) {
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
const getColorInfo = (options) => {
    const { colorRequired = true, color } = options;
    let colorClasses = '';
    let isSchemeColor = false;
    if (!isNil(color)) {
        const schemeColor = find(schemeColorOrder, (functionalColor) => functionalColor === color);
        if (isNil(schemeColor)) {
            colorClasses = getPaletteColorClasses(options);
        }
        else {
            colorClasses = getSchemeColorClasses(options);
            isSchemeColor = true;
        }
    }
    else if (!colorRequired) {
        colorClasses = getSchemeColorClasses(options);
        isSchemeColor = true;
    }
    return { colorClasses, isSchemeColor };
};
const schemeColorPropType = PropTypes.oneOf(schemeColorOrder);
PropTypes.oneOf(paletteColorOrder);
const colorPropType = PropTypes.oneOf(colorOrder);
const shadePropType = PropTypes.oneOf(paletteShades);

export { colorOrder, colorPropType, getColorInfo, getPaletteColorClasses, getSchemeColorClasses, paletteColorOrder, paletteShades, schemeColorOrder, schemeColorPropType, shadePropType };
