import { reduce, find, isNil } from 'lodash-es';

export const schemeColorOrder = [
    'primary',
    'secondary',
    'info',
    'success',
    'warn',
    'danger',
] as const;

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
] as const;

export const paletteShades = [
    'darkest',
    'darker',
    'dark',
    'light',
    'lighter',
    'lightest',
] as const;

export const colorOrder = [...schemeColorOrder, ...paletteColorOrder];

export type SchemeColor = typeof schemeColorOrder[number];
export type PaletteColor = typeof paletteColorOrder[number];
export type Color = SchemeColor | PaletteColor;
export type PaletteShade = typeof paletteShades[number];

export const functionalColorLevels = reduce(
    schemeColorOrder,
    (acc: Record<string, number>, color, index) => {
        acc[color] = index;

        return acc;
    },
    {},
);

export const paletteColorLevels = reduce(
    paletteColorOrder,
    (acc: Record<string, number>, color, index) => {
        acc[color] = index;

        return acc;
    },
    {},
);

interface SchemeColorClassesOptions {
    colorRequired?: boolean;
    color?: string | null;
    enableBorder?: boolean;
    design?: string | null;
    borderWidth?: string | number | null;
}

export function getSchemeColorClasses({
    colorRequired = true,
    color,
    enableBorder,
    design,
    borderWidth,
}: SchemeColorClassesOptions): string {
    if (isNil(color) && colorRequired) {
        return '';
    }

    let classes = '.ra-scheme';
    classes = !isNil(color) ? `${classes} sch-${color}` : classes;
    classes = !isNil(design) ? `${classes} sch-${design}` : classes;
    classes = enableBorder ? `${classes} sch-br` : classes;
    classes = !isNil(borderWidth)
        ? `${classes} border-${borderWidth}`
        : classes;

    return classes;
}

interface PaletteColorClassesOptions {
    colorRequired?: boolean;
    color?: string | null;
    enableBorder?: boolean;
    enableBackground?: boolean;
    shade?: string | null;
    borderWidth?: string | number | null;
}

export function getPaletteColorClasses({
    colorRequired = true,
    color,
    enableBorder,
    enableBackground,
    shade,
    borderWidth,
}: PaletteColorClassesOptions): string {
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

type ColorInfoOptions = SchemeColorClassesOptions & PaletteColorClassesOptions;

export const getColorInfo = (options: ColorInfoOptions): { colorClasses: string; isSchemeColor: boolean } => {
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
