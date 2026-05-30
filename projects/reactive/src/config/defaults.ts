import type {
    ConfigState,
    InteractiveScheme,
    PaletteRef,
    PaletteShade,
    TypographyConfig,
    VariantStates,
} from './types.js';

const T: PaletteRef = 'transparent';
const ref = (palette: string, shade: PaletteShade): PaletteRef => ({ palette, shade });

const DISABLED_BASE_CLR: PaletteRef = ref('gray', 400);
const DISABLED_FILL_CLR: PaletteRef = ref('gray', 100);
const DISABLED_FILL_BG: PaletteRef = ref('gray', 400);

function baseVariant(
    clr: PaletteRef,
    hoverClr: PaletteRef,
    focusClr: PaletteRef,
    activeClr: PaletteRef,
    disabledClr?: PaletteRef,
): VariantStates {
    return {
        default:  { clr,                                       bg: T, br: T, out: T },
        hover:    { clr: hoverClr,                             bg: T, br: T, out: T },
        focus:    { clr: focusClr,                             bg: T, br: T, out: T },
        active:   { clr: activeClr,                            bg: T, br: T, out: T },
        disabled: { clr: disabledClr ?? DISABLED_BASE_CLR,     bg: T, br: T, out: T },
    };
}

function fillVariant(
    clr: PaletteRef,
    baseBg: PaletteRef,
    hoverBg: PaletteRef,
    hoverBr: PaletteRef,
    focusBg: PaletteRef,
    focusBr: PaletteRef,
    focusOut: PaletteRef,
    activeBg: PaletteRef,
    activeBr: PaletteRef,
    disabledClr?: PaletteRef,
    disabledBg?: PaletteRef,
): VariantStates {
    return {
        default: { clr,         bg: baseBg,   br: baseBg,   out: T },
        hover:   { clr,         bg: hoverBg,  br: hoverBr,  out: T },
        focus:   { clr,         bg: focusBg,  br: focusBr,  out: focusOut },
        active:  { clr,         bg: activeBg, br: activeBr, out: T },
        disabled: {
            clr: disabledClr ?? DISABLED_FILL_CLR,
            bg: disabledBg ?? DISABLED_FILL_BG,
            br: disabledBg ?? DISABLED_FILL_BG,
            out: T,
        },
    };
}

const defaultScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('gray', 900), ref('gray', 800), ref('gray', 800), ref('gray', 700), ref('gray', 400)),
        fill: fillVariant(ref('gray', 100), ref('gray', 900), ref('gray', 800), ref('gray', 800), ref('gray', 800), ref('gray', 800), ref('gray', 500), ref('gray', 700), ref('gray', 700), ref('gray', 100), ref('gray', 400)),
    },
};

const primaryScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('blue', 500), ref('blue', 600), ref('blue', 600), ref('blue', 600)),
        fill: fillVariant(ref('gray', 100), ref('blue', 500), ref('blue', 600), ref('blue', 600), ref('blue', 600), ref('blue', 600), ref('blue', 300), ref('blue', 600), ref('blue', 600)),
    },
};

const secondaryScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('gray', 500), ref('gray', 600), ref('gray', 600), ref('gray', 600)),
        fill: fillVariant(ref('gray', 100), ref('gray', 500), ref('gray', 600), ref('gray', 600), ref('gray', 600), ref('gray', 600), ref('gray', 400), ref('gray', 600), ref('gray', 600)),
    },
};

const infoScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('cyan', 500), ref('cyan', 400), ref('red', 600), ref('red', 600)),
        fill: fillVariant(ref('gray', 900), ref('cyan', 500), ref('cyan', 400), ref('cyan', 400), ref('cyan', 400), ref('cyan', 400), ref('cyan', 300), ref('cyan', 400), ref('cyan', 400)),
    },
};

const successScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('green', 500), ref('green', 600), ref('green', 600), ref('green', 600)),
        fill: fillVariant(ref('gray', 100), ref('green', 500), ref('green', 600), ref('green', 600), ref('green', 600), ref('green', 600), ref('green', 300), ref('green', 600), ref('green', 600)),
    },
};

const warnScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('yellow', 500), ref('yellow', 400), ref('yellow', 400), ref('yellow', 400)),
        fill: fillVariant(ref('gray', 900), ref('yellow', 500), ref('yellow', 400), ref('yellow', 400), ref('yellow', 400), ref('yellow', 400), ref('yellow', 300), ref('yellow', 400), ref('yellow', 400)),
    },
};

const dangerScheme: InteractiveScheme = {
    variants: {
        base: baseVariant(ref('red', 500), ref('red', 600), ref('red', 600), ref('red', 600)),
        fill: fillVariant(ref('gray', 100), ref('red', 500), ref('red', 600), ref('red', 600), ref('red', 600), ref('red', 600), ref('red', 300), ref('red', 600), ref('red', 600)),
    },
};

const typographyDefaults: TypographyConfig = {
    heading: {
        color: '#1a1a1a',
        'font-weight': 700,
        levels: [
            { 'font-size': '56px', 'line-height': '64px', mobile: { 'font-size': '32px', 'line-height': '40px' }, desktop: null },
            { 'font-size': '48px', 'line-height': '56px', mobile: { 'font-size': '28px', 'line-height': '34px' }, desktop: null },
            { 'font-size': '40px', 'line-height': '48px', mobile: { 'font-size': '28px', 'line-height': '34px' }, desktop: null },
            { 'font-size': '32px', 'line-height': '40px', mobile: { 'font-size': '28px', 'line-height': '34px' }, desktop: null },
            { 'font-size': '28px', 'line-height': '34px', mobile: null, desktop: null },
        ],
    },
    subHeading: {
        color: '#1a1a1a',
        'font-weight': 700,
        levels: [
            { 'font-size': '28px', 'line-height': '34px', mobile: { 'font-size': '20px', 'line-height': '24px' }, desktop: null },
            { 'font-size': '24px', 'line-height': '30px', mobile: { 'font-size': '18px', 'line-height': '22px' }, desktop: null },
            { 'font-size': '22px', 'line-height': '28px', mobile: { 'font-size': '18px', 'line-height': '22px' }, desktop: null },
            { 'font-size': '20px', 'line-height': '24px', mobile: { 'font-size': '18px', 'line-height': '22px' }, desktop: null },
            { 'font-size': '18px', 'line-height': '22px', mobile: null, desktop: null },
        ],
    },
    text: {
        color: 'inherit',
        'font-weight': 400,
        sizes: [
            { 'font-size': '18px', 'line-height': '22px', mobile: null, desktop: null },
            { 'font-size': '16px', 'line-height': '20px', mobile: null, desktop: null },
            { 'font-size': '15px', 'line-height': '19px', mobile: null, desktop: null },
            { 'font-size': '14px', 'line-height': '18px', mobile: null, desktop: null },
            { 'font-size': '12px', 'line-height': '16px', mobile: null, desktop: null },
        ],
    },
    paragraph: {
        color: '#333333',
        'font-weight': 400,
        sizes: [
            { 'font-size': '16px', 'line-height': '22px', 'margin-bottom': '24px', mobile: null, desktop: null },
            { 'font-size': '18px', 'line-height': '24px', 'margin-bottom': '32px', mobile: null, desktop: null },
            { 'font-size': '20px', 'line-height': '26px', 'margin-bottom': '32px', mobile: null, desktop: null },
        ],
    },
    caption: {
        'font-size': '14px',
        'line-height': '18px',
        color: '#1a1a1a',
        'font-weight': 700,
    },
    overline: {
        'font-size': '14px',
        'line-height': '20px',
        color: '#666666',
        'font-weight': 600,
    },
    weights: {
        normal: 400,
        medium: 400,
        'semi-bold': 600,
        bold: 700,
    },
};

export const DEFAULT_CONFIG: ConfigState = {
    palette: {
        colors: {
            blue: { 100: '#cfe2ff', 200: '#9ec5fe', 300: '#6ea8fe', 400: '#3d8bfd', 500: '#0d6efd', 600: '#0a58ca', 700: '#084298', 800: '#052c65', 900: '#031633' },
            purple: { 100: '#e2d9f3', 200: '#c5b3e6', 300: '#a98eda', 400: '#8c68cd', 500: '#6f42c1', 600: '#59359a', 700: '#432874', 800: '#2c1a4d', 900: '#160d27' },
            green: { 100: '#d1e7dd', 200: '#a3cfbb', 300: '#75b798', 400: '#479f76', 500: '#198754', 600: '#146c43', 700: '#0f5132', 800: '#0a3622', 900: '#051b11' },
            yellow: { 100: '#fff3cd', 200: '#ffe69c', 300: '#ffda6a', 400: '#ffcd39', 500: '#ffc107', 600: '#cc9a06', 700: '#997404', 800: '#664d03', 900: '#332701' },
            orange: { 100: '#ffe5d0', 200: '#fecba1', 300: '#feb272', 400: '#fd9843', 500: '#fd7e14', 600: '#ca6510', 700: '#984c0c', 800: '#653208', 900: '#331904' },
            red: { 100: '#f8d7da', 200: '#f1aeb5', 300: '#ea868f', 400: '#e35d6a', 500: '#dc3545', 600: '#b02a37', 700: '#842029', 800: '#58151c', 900: '#2c0b0e' },
            cyan: { 100: '#cff4fc', 200: '#9eeaf9', 300: '#6edff6', 400: '#3dd5f3', 500: '#0dcaf0', 600: '#0aa6c2', 700: '#087990', 800: '#055160', 900: '#032830' },
            gray: { 100: '#ffffff', 200: '#e6e6e6', 300: '#cccccc', 400: '#999999', 500: '#808080', 600: '#666666', 700: '#4d4d4d', 800: '#333333', 900: '#000000' },
        },
        custom: {},
    },
    interactiveDesigns: {
        schemes: {
            default: defaultScheme,
            primary: primaryScheme,
            secondary: secondaryScheme,
            info: infoScheme,
            success: successScheme,
            warn: warnScheme,
            danger: dangerScheme,
        },
        custom: {},
    },
    system: {
        colors: {
            defaults: {
                'page-background': '#f7f7f7',
            },
            custom: {},
        },
        styles: {
            defaults: {
                'screen-max-width': '1710px',
            },
            custom: {},
        },
    },
    base: {
        fontSize: '16px',
        fontWeight: 400,
    },
    button: {
        defaultDesign: {
            'padding-v': '6px',
            'padding-h': '12px',
            'border-radius': '6px',
            'font-size': '16px',
            'font-weight': 400,
            'line-height': '24px',
        },
        designs: {},
    },
    tabs: {
        cornerStyle: 'rounded-ends',
        innerBorder: 'none',
        outerBorder: 'none',
        borderRadius: '10px',
        textColor: '#333333',
        bgColor: '#D9D9D9',
        verticalPadding: '8px',
        horizontalPadding: '16px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '14px',
        activeTextColor: null,
        activeBgColor: '#F2F2F2',
        activeVerticalPadding: null,
        activeHorizontalPadding: null,
        activeFontSize: null,
        activeFontWeight: null,
        activeLineHeight: null,
        disabledTextColor: '#999999',
        disabledBgColor: '#E2E2E2',
        disabledVerticalPadding: null,
        disabledHorizontalPadding: null,
        disabledFontSize: null,
        disabledFontWeight: null,
        disabledLineHeight: null,
        bottomBgColor: '#F2F2F2',
        bottomPaddingTop: '40px',
        bottomPaddingBottom: '40px',
        bottomPaddingLeft: '24px',
        bottomPaddingRight: '24px',
        bottomBorderRadius: '10px',
    },
    inputs: {
        focusColor: '#0870f5',
        borderRadius: '5px',
        borderWidth: '1px',
        focusedBorderWidth: '2px',
        containerDefault: {
            height: '40px',
            'padding-h': '12px',
            'padding-v': '0',
            'font-size': '16px',
            'font-weight': 400,
            'line-height': '24px',
            'background-color': '#ffffff',
            'border-width': '1px',
            'focus-outline-width': '1px',
        },
        containerVariants: {},
    },
    layout: {
        breakpoints: ['600px', '992px', '1200px', '1800px'],
        tabletBreakpoint: 1,
        desktopBreakpoint: 2,
    },
    typography: typographyDefaults,
};
