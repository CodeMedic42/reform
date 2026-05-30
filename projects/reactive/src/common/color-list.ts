import { reduce, isNil } from 'lodash-es';

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
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
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
    variant?: string | null;
    borderWidth?: string | number | null;
}

export function getSchemeColorClasses({
    colorRequired = true,
    color,
    enableBorder,
    variant,
    borderWidth,
}: SchemeColorClassesOptions): string {
    if (isNil(color) && colorRequired) {
        return '';
    }

    let classes = 'ra-clr-int';
    classes = !isNil(color) ? `${classes} ra-clr-int-${color}` : classes;
    classes = !isNil(variant) ? `${classes} ra-clr-int-${variant}` : classes;
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

    let classes = '';
    classes = !isNil(color) ? `ra-clr-plt-${color}` : classes;
    classes = !isNil(shade) ? `${classes} plt-${shade}` : classes;
    classes = enableBorder ? `${classes} plt-br` : classes;
    classes = enableBackground ? `${classes} plt-bg` : classes;
    classes = `${classes} plt-clr`;
    classes = !isNil(borderWidth)
        ? `${classes} border-${borderWidth}`
        : classes;

    return classes;
}

export const getColorInfo = (options: PaletteColorClassesOptions): { colorClasses: string } => {
    return { colorClasses: getPaletteColorClasses(options) };
};
