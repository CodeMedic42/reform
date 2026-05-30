export interface PaletteShades {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
}

export type PaletteShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type PaletteRef =
    | { palette: string; shade: PaletteShade }
    | 'transparent';

export interface VariantStateSlots {
    clr: PaletteRef;
    bg: PaletteRef;
    br: PaletteRef;
    out: PaletteRef;
}

export interface VariantStates {
    default: VariantStateSlots;
    hover: VariantStateSlots;
    focus: VariantStateSlots;
    active: VariantStateSlots;
    disabled: VariantStateSlots;
}

export interface InteractiveScheme {
    variants: Record<string, VariantStates>;
}

export interface ButtonDesign {
    'padding-v': string;
    'padding-h': string;
    'border-radius': string;
    'font-size': string;
    'font-weight': number;
    'line-height': string;
    'min-width'?: string;
}

export interface FieldContainerVariant {
    height: string;
    'padding-h': string;
    'padding-v': string;
    'font-size': string;
    'font-weight': number;
    'line-height': string;
    'background-color': string;
    'border-width': string;
    'focus-outline-width': string;
}

export interface TabConfig {
    cornerStyle: string;
    innerBorder: string;
    outerBorder: string;
    borderRadius: string;
    textColor: string;
    bgColor: string;
    verticalPadding: string;
    horizontalPadding: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: string;
    activeTextColor: string | null;
    activeBgColor: string;
    activeVerticalPadding: string | null;
    activeHorizontalPadding: string | null;
    activeFontSize: string | null;
    activeFontWeight: number | null;
    activeLineHeight: string | null;
    disabledTextColor: string;
    disabledBgColor: string;
    disabledVerticalPadding: string | null;
    disabledHorizontalPadding: string | null;
    disabledFontSize: string | null;
    disabledFontWeight: number | null;
    disabledLineHeight: string | null;
    bottomBgColor: string;
    bottomPaddingTop: string;
    bottomPaddingBottom: string;
    bottomPaddingLeft: string;
    bottomPaddingRight: string;
    bottomBorderRadius: string;
}

export interface TypographyResponsiveTier {
    'font-size': string;
    'line-height': string;
}

export interface ParagraphResponsiveTier extends TypographyResponsiveTier {
    'margin-bottom': string;
}

export interface HeadingLevelConfig {
    'font-size': string;
    'line-height': string;
    mobile: TypographyResponsiveTier | null;
    desktop: TypographyResponsiveTier | null;
}

export interface TextSizeConfig {
    'font-size': string;
    'line-height': string;
    mobile: TypographyResponsiveTier | null;
    desktop: TypographyResponsiveTier | null;
}

export interface ParagraphSizeConfig {
    'font-size': string;
    'line-height': string;
    'margin-bottom': string;
    mobile: ParagraphResponsiveTier | null;
    desktop: ParagraphResponsiveTier | null;
}

export interface TypographyConfig {
    heading: {
        color: string;
        'font-weight': number;
        levels: HeadingLevelConfig[];
    };
    subHeading: {
        color: string;
        'font-weight': number;
        levels: HeadingLevelConfig[];
    };
    text: {
        color: string;
        'font-weight': number;
        sizes: TextSizeConfig[];
    };
    paragraph: {
        color: string;
        'font-weight': number;
        sizes: ParagraphSizeConfig[];
    };
    caption: {
        'font-size': string;
        'line-height': string;
        color: string;
        'font-weight': number;
    };
    overline: {
        'font-size': string;
        'line-height': string;
        color: string;
        'font-weight': number;
    };
    weights: Record<string, number>;
}

export interface ConfigState {
    palette: {
        colors: Record<string, PaletteShades>;
        custom: Record<string, PaletteShades>;
    };
    interactiveDesigns: {
        schemes: Record<string, InteractiveScheme>;
        custom: Record<string, InteractiveScheme>;
    };
    system: {
        colors: {
            defaults: Record<string, string>;
            custom: Record<string, string>;
        };
        styles: {
            defaults: Record<string, string>;
            custom: Record<string, string>;
        };
    };
    base: {
        fontSize: string;
        fontWeight: number;
    };
    button: {
        defaultDesign: ButtonDesign;
        designs: Record<string, ButtonDesign>;
    };
    tabs: TabConfig;
    inputs: {
        focusColor: string;
        borderRadius: string;
        borderWidth: string;
        focusedBorderWidth: string;
        containerDefault: FieldContainerVariant;
        containerVariants: Record<string, FieldContainerVariant>;
    };
    layout: {
        breakpoints: string[];
        tabletBreakpoint: number | null;
        desktopBreakpoint: number | null;
    };
    typography: TypographyConfig;
}
