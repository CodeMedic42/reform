import type { ConfigState, PaletteShades, InteractiveScheme, VariantStates, VariantStateSlots, ButtonDesign, FieldContainerVariant, HeadingLevelConfig, TextSizeConfig, ParagraphSizeConfig, TypographyResponsiveTier, ParagraphResponsiveTier } from '../types';
import { DEFAULT_CONFIG } from '../defaults';
import { buildPaletteMap, resolvePaletteRef, type PaletteMap } from '../util/resolve-palette-ref';

const STATE_KEYS: (keyof VariantStates)[] = ['default', 'hover', 'focus', 'active', 'disabled'];
const SLOT_KEYS: (keyof VariantStateSlots)[] = ['clr', 'bg', 'br', 'out'];

function statePrefix(state: keyof VariantStates): string {
    return state === 'default' ? '' : `${state}-`;
}

function indent(str: string, level: number): string {
    return '    '.repeat(level) + str;
}

function formatPaletteMap(shades: PaletteShades): string {
    const lines = [100, 200, 300, 400, 500, 600, 700, 800, 900].map(
        (shade) => indent(`${shade}: ${shades[shade as keyof PaletteShades]},`, 2),
    );
    return `(\n${lines.join('\n')}\n${indent(')', 1)}`;
}

function formatVariantStates(states: VariantStates, palettes: PaletteMap, indentLevel: number): string {
    const lines: string[] = [];
    for (const state of STATE_KEYS) {
        const slots = states[state];
        const prefix = statePrefix(state);
        for (const slot of SLOT_KEYS) {
            const resolved = resolvePaletteRef(slots[slot], palettes);
            lines.push(indent(`"${prefix}${slot}": ${resolved},`, indentLevel));
        }
    }
    return `(\n${lines.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatInteractiveScheme(scheme: InteractiveScheme, palettes: PaletteMap, indentLevel: number): string {
    const entries: string[] = [];
    for (const [variantName, states] of Object.entries(scheme.variants)) {
        const key = variantName === 'base' ? '""' : `"${variantName}"`;
        entries.push(indent(`${key}: ${formatVariantStates(states, palettes, indentLevel + 1)},`, indentLevel));
    }
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatButtonDesign(design: ButtonDesign): string {
    const entries = Object.entries(design)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => indent(`"${k}": ${typeof v === 'number' ? v : v},`, 2));
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function formatFieldContainerVariant(variant: FieldContainerVariant): string {
    const entries = Object.entries(variant)
        .map(([k, v]) => indent(`"${k}": ${typeof v === 'number' ? v : v},`, 2));
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function formatResponsiveTier(tier: TypographyResponsiveTier | ParagraphResponsiveTier | null, indentLevel: number): string {
    if (tier === null) return 'null';
    const entries = Object.entries(tier)
        .map(([k, v]) => indent(`"${k}": ${v},`, indentLevel));
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatLevelMap(levels: HeadingLevelConfig[]): string {
    const entries = levels.map((level, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${level['font-size']},`, 3),
            indent(`"line-height": ${level['line-height']},`, 3),
            indent(`"mobile": ${formatResponsiveTier(level.mobile, 4)},`, 3),
            indent(`"desktop": ${formatResponsiveTier(level.desktop, 4)},`, 3),
        ];
        return `${indent(`${id}: (`, 2)}\n${inner.join('\n')}\n${indent('),', 2)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function formatTextSizeMap(sizes: TextSizeConfig[]): string {
    const entries = sizes.map((size, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${size['font-size']},`, 3),
            indent(`"line-height": ${size['line-height']},`, 3),
            indent(`"mobile": ${formatResponsiveTier(size.mobile, 4)},`, 3),
            indent(`"desktop": ${formatResponsiveTier(size.desktop, 4)},`, 3),
        ];
        return `${indent(`${id}: (`, 2)}\n${inner.join('\n')}\n${indent('),', 2)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function formatParagraphSizeMap(sizes: ParagraphSizeConfig[]): string {
    const entries = sizes.map((size, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${size['font-size']},`, 3),
            indent(`"line-height": ${size['line-height']},`, 3),
            indent(`"margin-bottom": ${size['margin-bottom']},`, 3),
            indent(`"mobile": ${formatResponsiveTier(size.mobile, 4)},`, 3),
            indent(`"desktop": ${formatResponsiveTier(size.desktop, 4)},`, 3),
        ];
        return `${indent(`${id}: (`, 2)}\n${inner.join('\n')}\n${indent('),', 2)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function formatWeightsMap(weights: Record<string, number>): string {
    const entries = Object.entries(weights)
        .map(([k, v]) => indent(`"${k}": ${v},`, 2));
    return `(\n${entries.join('\n')}\n${indent(')', 1)}`;
}

function mapsEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function generateScss(config: ConfigState): string {
    const lines: string[] = [
        '// Generated by @reformjs/reactive Configuration Panel',
        '',
    ];

    // Base typography
    if (config.base.fontSize !== DEFAULT_CONFIG.base.fontSize) {
        lines.push(`$ra-config-default-font-size: ${config.base.fontSize};`);
    }
    if (config.base.fontWeight !== DEFAULT_CONFIG.base.fontWeight) {
        lines.push(`$ra-config-default-font-weight: ${config.base.fontWeight};`);
    }

    // Palette colors - always emit all active colors since the library has no built-in defaults
    for (const [name, shades] of Object.entries(config.palette.colors)) {
        lines.push('');
        lines.push(`$ra-config-palette-color-${name}: ${formatPaletteMap(shades)};`);
    }

    // Custom palette colors
    if (Object.keys(config.palette.custom).length > 0) {
        lines.push('');
        const entries = Object.entries(config.palette.custom)
            .map(([name, shades]) => `${indent(`"${name}": ${formatPaletteMap(shades)},`, 1)}`);
        lines.push(`$ra-config-palette-colors-custom: (\n${entries.join('\n')}\n);`);
    }

    // Interactive design schemes - resolved palette refs to hex
    const palettes: PaletteMap = buildPaletteMap(config);
    const schemeEntries = Object.entries(config.interactiveDesigns.schemes);
    const defaultScheme = schemeEntries.find(([n]) => n === 'default')?.[1];
    const nonDefaultSchemes = schemeEntries.filter(([n]) => n !== 'default');

    if (defaultScheme) {
        lines.push('');
        lines.push(`$ra-config-interactive-color-default: ${formatInteractiveScheme(defaultScheme, palettes, 2)};`);
    }

    // Union of non-base variant names across all schemes
    const variantNames = new Set<string>();
    for (const [, scheme] of [...schemeEntries, ...Object.entries(config.interactiveDesigns.custom)]) {
        for (const variant of Object.keys(scheme.variants)) {
            if (variant !== 'base') variantNames.add(variant);
        }
    }
    const variantList = [...variantNames].map((v) => `'${v}'`).join(', ');
    lines.push('');
    lines.push(`$ra-config-interactive-designs: ${variantList || '()'};`);

    // Combined interactive colors map (default scheme is emitted separately above)
    const combinedSchemes = [
        ...nonDefaultSchemes,
        ...Object.entries(config.interactiveDesigns.custom),
    ];
    if (combinedSchemes.length > 0) {
        lines.push('');
        lines.push('$ra-config-interactive-colors: (');
        for (const [name, scheme] of combinedSchemes) {
            lines.push(indent(`"${name}": ${formatInteractiveScheme(scheme, palettes, 2)},`, 1));
        }
        lines.push(');');
    }

    // System colors - always emit all active colors since the library has no built-in defaults
    for (const [name, value] of Object.entries(config.system.colors.defaults)) {
        lines.push(`$ra-config-system-color-${name}: ${value};`);
    }
    if (Object.keys(config.system.colors.custom).length > 0) {
        lines.push('');
        const entries = Object.entries(config.system.colors.custom)
            .map(([name, value]) => `${indent(`"${name}": ${value},`, 1)}`);
        lines.push(`$ra-config-system-colors-custom: (\n${entries.join('\n')}\n);`);
    }

    // System styles - always emit all active styles since the library has no built-in defaults
    for (const [name, value] of Object.entries(config.system.styles.defaults)) {
        lines.push(`$ra-config-system-style-${name}: ${value};`);
    }
    if (Object.keys(config.system.styles.custom).length > 0) {
        lines.push('');
        const entries = Object.entries(config.system.styles.custom)
            .map(([name, value]) => `${indent(`"${name}": ${value},`, 1)}`);
        lines.push(`$ra-config-system-styles-custom: (\n${entries.join('\n')}\n);`);
    }

    // Input settings
    if (config.inputs.focusColor !== DEFAULT_CONFIG.inputs.focusColor) {
        lines.push(`$ra-config-inputs-focus-color: ${config.inputs.focusColor};`);
    }
    if (config.inputs.borderRadius !== DEFAULT_CONFIG.inputs.borderRadius) {
        lines.push(`$ra-config-inputs-border-radius: ${config.inputs.borderRadius};`);
    }
    if (config.inputs.borderWidth !== DEFAULT_CONFIG.inputs.borderWidth) {
        lines.push(`$ra-config-inputs-border-width: ${config.inputs.borderWidth};`);
    }
    if (config.inputs.focusedBorderWidth !== DEFAULT_CONFIG.inputs.focusedBorderWidth) {
        lines.push(`$ra-config-inputs-focused-border-width: ${config.inputs.focusedBorderWidth};`);
    }
    if (!mapsEqual(config.inputs.containerDefault as unknown as Record<string, unknown>, DEFAULT_CONFIG.inputs.containerDefault as unknown as Record<string, unknown>)) {
        lines.push('');
        lines.push(`$ra-config-input-container-default-variant: ${formatFieldContainerVariant(config.inputs.containerDefault)};`);
    }
    if (Object.keys(config.inputs.containerVariants).length > 0) {
        lines.push('');
        const entries = Object.entries(config.inputs.containerVariants)
            .map(([name, variant]) => `${indent(`"${name}": ${formatFieldContainerVariant(variant)},`, 1)}`);
        lines.push(`$ra-config-input-container-variants: (\n${entries.join('\n')}\n);`);
    }

    // Tab settings
    const tabFields: [keyof typeof config.tabs, string][] = [
        ['cornerStyle', '$ra-config-tab-corner-style'],
        ['innerBorder', '$ra-config-tab-inner-border'],
        ['outerBorder', '$ra-config-tab-outer-border'],
        ['borderRadius', '$ra-config-tab-border-radius'],
        ['textColor', '$ra-config-tab-text-color'],
        ['bgColor', '$ra-config-tab-bg-color'],
        ['verticalPadding', '$ra-config-tab-vertical-padding'],
        ['horizontalPadding', '$ra-config-tab-horizontal-padding'],
        ['fontSize', '$ra-config-tab-font-size'],
        ['fontWeight', '$ra-config-tab-font-weight'],
        ['lineHeight', '$ra-config-tab-line-height'],
        ['activeTextColor', '$ra-config-tab-active-text-color'],
        ['activeBgColor', '$ra-config-tab-active-bg-color'],
        ['activeVerticalPadding', '$ra-config-tab-active-vertical-padding'],
        ['activeHorizontalPadding', '$ra-config-tab-active-horizontal-padding'],
        ['activeFontSize', '$ra-config-tab-active-font-size'],
        ['activeFontWeight', '$ra-config-tab-active-font-weight'],
        ['activeLineHeight', '$ra-config-tab-active-line-height'],
        ['disabledTextColor', '$ra-config-tab-disabled-text-color'],
        ['disabledBgColor', '$ra-config-tab-disabled-bg-color'],
        ['disabledVerticalPadding', '$ra-config-tab-disabled-vertical-padding'],
        ['disabledHorizontalPadding', '$ra-config-tab-disabled-horizontal-padding'],
        ['disabledFontSize', '$ra-config-tab-disabled-font-size'],
        ['disabledFontWeight', '$ra-config-tab-disabled-font-weight'],
        ['disabledLineHeight', '$ra-config-tab-disabled-line-height'],
        ['bottomBgColor', '$ra-config-tab-bottom-bg-color'],
        ['bottomPaddingTop', '$ra-config-tab-bottom-padding-top'],
        ['bottomPaddingBottom', '$ra-config-tab-bottom-padding-bottom'],
        ['bottomPaddingLeft', '$ra-config-tab-bottom-padding-left'],
        ['bottomPaddingRight', '$ra-config-tab-bottom-padding-right'],
        ['bottomBorderRadius', '$ra-config-tab-bottom-border-radius'],
    ];

    for (const [key, varName] of tabFields) {
        const current = config.tabs[key];
        const defaultVal = DEFAULT_CONFIG.tabs[key];
        if (current !== defaultVal) {
            const value = current === null ? 'null' :
                          typeof current === 'string' && key === 'cornerStyle' ? `'${current}'` :
                          String(current);
            lines.push(`${varName}: ${value};`);
        }
    }

    // Typography settings
    const typo = config.typography;
    const defTypo = DEFAULT_CONFIG.typography;

    if (typo.heading.color !== defTypo.heading.color) {
        lines.push(`$ra-config-typography-heading-color: ${typo.heading.color};`);
    }
    if (typo.heading['font-weight'] !== defTypo.heading['font-weight']) {
        lines.push(`$ra-config-typography-heading-font-weight: ${typo.heading['font-weight']};`);
    }
    if (JSON.stringify(typo.heading.levels) !== JSON.stringify(defTypo.heading.levels)) {
        lines.push(`$ra-config-typography-heading-levels: ${formatLevelMap(typo.heading.levels)};`);
    }

    if (typo.subHeading.color !== defTypo.subHeading.color) {
        lines.push(`$ra-config-typography-sub-heading-color: ${typo.subHeading.color};`);
    }
    if (typo.subHeading['font-weight'] !== defTypo.subHeading['font-weight']) {
        lines.push(`$ra-config-typography-sub-heading-font-weight: ${typo.subHeading['font-weight']};`);
    }
    if (JSON.stringify(typo.subHeading.levels) !== JSON.stringify(defTypo.subHeading.levels)) {
        lines.push(`$ra-config-typography-sub-heading-levels: ${formatLevelMap(typo.subHeading.levels)};`);
    }

    if (typo.text.color !== defTypo.text.color) {
        lines.push(`$ra-config-typography-text-color: ${typo.text.color};`);
    }
    if (typo.text['font-weight'] !== defTypo.text['font-weight']) {
        lines.push(`$ra-config-typography-text-font-weight: ${typo.text['font-weight']};`);
    }
    if (JSON.stringify(typo.text.sizes) !== JSON.stringify(defTypo.text.sizes)) {
        lines.push(`$ra-config-typography-text-sizes: ${formatTextSizeMap(typo.text.sizes)};`);
    }

    if (typo.paragraph.color !== defTypo.paragraph.color) {
        lines.push(`$ra-config-typography-paragraph-color: ${typo.paragraph.color};`);
    }
    if (typo.paragraph['font-weight'] !== defTypo.paragraph['font-weight']) {
        lines.push(`$ra-config-typography-paragraph-font-weight: ${typo.paragraph['font-weight']};`);
    }
    if (JSON.stringify(typo.paragraph.sizes) !== JSON.stringify(defTypo.paragraph.sizes)) {
        lines.push(`$ra-config-typography-paragraph-sizes: ${formatParagraphSizeMap(typo.paragraph.sizes)};`);
    }

    if (typo.caption['font-size'] !== defTypo.caption['font-size']) {
        lines.push(`$ra-config-typography-caption-font-size: ${typo.caption['font-size']};`);
    }
    if (typo.caption['line-height'] !== defTypo.caption['line-height']) {
        lines.push(`$ra-config-typography-caption-line-height: ${typo.caption['line-height']};`);
    }
    if (typo.caption.color !== defTypo.caption.color) {
        lines.push(`$ra-config-typography-caption-color: ${typo.caption.color};`);
    }
    if (typo.caption['font-weight'] !== defTypo.caption['font-weight']) {
        lines.push(`$ra-config-typography-caption-font-weight: ${typo.caption['font-weight']};`);
    }

    if (typo.overline['font-size'] !== defTypo.overline['font-size']) {
        lines.push(`$ra-config-typography-overline-font-size: ${typo.overline['font-size']};`);
    }
    if (typo.overline['line-height'] !== defTypo.overline['line-height']) {
        lines.push(`$ra-config-typography-overline-line-height: ${typo.overline['line-height']};`);
    }
    if (typo.overline.color !== defTypo.overline.color) {
        lines.push(`$ra-config-typography-overline-color: ${typo.overline.color};`);
    }
    if (typo.overline['font-weight'] !== defTypo.overline['font-weight']) {
        lines.push(`$ra-config-typography-overline-font-weight: ${typo.overline['font-weight']};`);
    }

    if (JSON.stringify(typo.weights) !== JSON.stringify(defTypo.weights)) {
        lines.push(`$ra-config-typography-weights: ${formatWeightsMap(typo.weights)};`);
    }

    // Layout breakpoints
    if (JSON.stringify(config.layout.breakpoints) !== JSON.stringify(DEFAULT_CONFIG.layout.breakpoints)) {
        lines.push(`$ra-config-resp-breakpoints: ${config.layout.breakpoints.join(', ')};`);
    }
    if (config.layout.tabletBreakpoint !== null) {
        const tabletValue = config.layout.breakpoints[config.layout.tabletBreakpoint];
        if (tabletValue) {
            lines.push(`$ra-config-tablet-resp-breakpoint: ${tabletValue};`);
        }
    }
    if (config.layout.desktopBreakpoint !== null) {
        const desktopValue = config.layout.breakpoints[config.layout.desktopBreakpoint];
        if (desktopValue) {
            lines.push(`$ra-config-desktop-resp-breakpoint: ${desktopValue};`);
        }
    }

    // Button settings
    if (!mapsEqual(config.button.defaultDesign as unknown as Record<string, unknown>, DEFAULT_CONFIG.button.defaultDesign as unknown as Record<string, unknown>)) {
        lines.push('');
        lines.push(`$ra-config-button-default-design: ${formatButtonDesign(config.button.defaultDesign)};`);
    }
    if (Object.keys(config.button.designs).length > 0) {
        lines.push('');
        const entries = Object.entries(config.button.designs)
            .map(([name, design]) => `${indent(`"${name}": ${formatButtonDesign(design)},`, 1)}`);
        lines.push(`$ra-config-button-designs: (\n${entries.join('\n')}\n);`);
    }

    lines.push('');
    lines.push("@import '@reformjs/reactive/dist/styles/scss/index.scss';");
    lines.push('');

    return lines.join('\n');
}
