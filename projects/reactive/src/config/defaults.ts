import type { ConfigState, InteractiveScheme, InteractiveVariant, TypographyConfig } from './types.js';

function baseVariant(
    clr: string,
    hoverClr: string,
    focusClr: string,
    activeClr: string,
    disabledClr?: string,
): InteractiveVariant {
    return {
        clr,
        bg: 'transparent',
        br: 'transparent',
        out: 'transparent',
        'hover-clr': hoverClr,
        'hover-bg': 'transparent',
        'hover-br': 'transparent',
        'hover-out': 'transparent',
        'focus-clr': focusClr,
        'focus-bg': 'transparent',
        'focus-br': 'transparent',
        'focus-out': 'transparent',
        'active-clr': activeClr,
        'active-bg': 'transparent',
        'active-br': 'transparent',
        'active-out': 'transparent',
        ...(disabledClr ? {
            'disabled-clr': disabledClr,
            'disabled-bg': 'transparent',
            'disabled-br': 'transparent',
            'disabled-out': 'transparent',
        } : {}),
    };
}

function fillVariant(
    clr: string,
    baseBg: string,
    hoverBg: string,
    hoverBr: string,
    focusBg: string,
    focusBr: string,
    focusOut: string,
    activeBg: string,
    activeBr: string,
    disabledClr?: string,
    disabledBg?: string,
): InteractiveVariant {
    return {
        clr,
        bg: baseBg,
        br: baseBg,
        out: 'transparent',
        'hover-clr': clr,
        'hover-bg': hoverBg,
        'hover-br': hoverBr,
        'hover-out': 'transparent',
        'focus-clr': clr,
        'focus-bg': focusBg,
        'focus-br': focusBr,
        'focus-out': focusOut,
        'active-clr': clr,
        'active-bg': activeBg,
        'active-br': activeBr,
        'active-out': 'transparent',
        ...(disabledClr ? {
            'disabled-clr': disabledClr,
            'disabled-bg': disabledBg,
            'disabled-br': disabledBg,
            'disabled-out': 'transparent',
        } : {}),
    };
}

const defaultScheme: InteractiveScheme = {
    base: baseVariant('#212529', '#424649', '#424649', '#4d5154', '#999999'),
    fill: fillVariant('#ffffff', '#212529', '#424649', '#424649', '#424649', '#424649', 'rgba(66, 70, 73, 0.5)', '#4d5154', '#4d5154', '#ffffff', '#999999'),
};

const primaryScheme: InteractiveScheme = {
    base: baseVariant('#0d6efd', '#0a58ca', '#0a58ca', '#0a58ca'),
    fill: fillVariant('#ffffff', '#0d6efd', '#0b5ed7', '#0a58ca', '#0b5ed7', '#0a58ca', 'rgba(49, 132, 253, 0.5)', '#0a58ca', '#0a53be'),
};

const secondaryScheme: InteractiveScheme = {
    base: baseVariant('#6c757d', '#5c636a', '#5c636a', '#565e64'),
    fill: fillVariant('#ffffff', '#6c757d', '#5c636a', '#5c636a', '#5c636a', '#5c636a', 'rgba(130, 138, 145, 0.5)', '#565e64', '#565e64'),
};

const infoScheme: InteractiveScheme = {
    base: baseVariant('#0dcaf0', '#31d2f2', '#b02a37', '#b02a37'),
    fill: fillVariant('#000000', '#0dcaf0', '#31d2f2', '#31d2f2', '#31d2f2', '#31d2f2', 'rgba(11, 172, 204, 0.5)', '#3dd5f3', '#3dd5f3'),
};

const successScheme: InteractiveScheme = {
    base: baseVariant('#198754', '#157347', '#157347', '#146c43'),
    fill: fillVariant('#ffffff', '#198754', '#157347', '#157347', '#157347', '#157347', 'rgba(60, 153, 110, 0.5)', '#146c43', '#146c43'),
};

const warnScheme: InteractiveScheme = {
    base: baseVariant('#ffc107', '#ffca2c', '#ffca2c', '#ffcd39'),
    fill: fillVariant('#000000', '#ffc107', '#ffca2c', '#ffca2c', '#ffca2c', '#ffca2c', 'rgba(217, 164, 6, 0.5)', '#ffcd39', '#ffcd39'),
};

const dangerScheme: InteractiveScheme = {
    base: baseVariant('#dc3545', '#b02a37', '#b02a37', '#b02a37'),
    fill: fillVariant('#ffffff', '#dc3545', '#b02a37', '#bb2d3b', '#bb2d3b', '#b02a37', 'rgba(225, 83, 97, 0.5)', '#b02a37', '#a52834'),
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
    grayscale: {
        'g-0': '#ffffff',
        'g-2': '#fafafa',
        'g-4': '#f5f5f5',
        'g-5': '#f2f2f2',
        'g-10': '#e6e6e6',
        'g-11': '#e3e3e3',
        'g-12': '#e0e0e0',
        'g-13': '#dedede',
        'g-20': '#cccccc',
        'g-30': '#b3b3b3',
        'g-40': '#999999',
        'g-50': '#808080',
        'g-60': '#666666',
        'g-70': '#4d4d4d',
        'g-80': '#333333',
        'g-90': '#1a1a1a',
        'g-100': '#000000',
        'white': '#ffffff',
        'black': '#000000',
        'transparent': 'transparent',
    },
    base: {
        fontSize: '16px',
        fontWeight: 400,
    },
    button: {
        defaultVariant: {
            'padding-v': '6px',
            'padding-h': '12px',
            'border-radius': '6px',
            'font-size': '16px',
            'font-weight': 400,
            'line-height': '24px',
        },
        variants: {},
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
