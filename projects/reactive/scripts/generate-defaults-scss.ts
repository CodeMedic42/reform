import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from '../src/config/defaults.js';
import type { PaletteShades, InteractiveVariant, InteractiveScheme, ButtonVariant, FieldContainerVariant, HeadingLevelConfig, TextSizeConfig, ParagraphSizeConfig, TypographyResponsiveTier, ParagraphResponsiveTier } from '../src/config/types.js';

function indent(str: string, level: number): string {
    return '    '.repeat(level) + str;
}

function formatPaletteMap(shades: PaletteShades, indentLevel: number): string {
    const lines = [100, 200, 300, 400, 500, 600, 700, 800, 900].map(
        (shade) => indent(`${shade}: ${shades[shade as keyof PaletteShades]},`, indentLevel),
    );
    return `(\n${lines.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatInteractiveVariant(variant: InteractiveVariant, indentLevel: number): string {
    const props = Object.entries(variant)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => indent(`"${k}": ${v},`, indentLevel));
    return `(\n${props.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatButtonVariant(variant: ButtonVariant, indentLevel: number): string {
    const entries = Object.entries(variant)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => indent(`"${k}": ${typeof v === 'number' ? v : v},`, indentLevel));
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatFieldContainerVariant(variant: FieldContainerVariant, indentLevel: number): string {
    const entries = Object.entries(variant)
        .map(([k, v]) => indent(`"${k}": ${typeof v === 'number' ? v : v},`, indentLevel));
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatResponsiveTier(tier: TypographyResponsiveTier | ParagraphResponsiveTier | null, indentLevel: number): string {
    if (tier === null) return 'null';
    const entries = Object.entries(tier)
        .map(([k, v]) => indent(`"${k}": ${v},`, indentLevel));
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatLevelMap(levels: HeadingLevelConfig[], indentLevel: number): string {
    const entries = levels.map((level, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${level['font-size']},`, indentLevel + 1),
            indent(`"line-height": ${level['line-height']},`, indentLevel + 1),
            indent(`"mobile": ${formatResponsiveTier(level.mobile, indentLevel + 2)},`, indentLevel + 1),
            indent(`"desktop": ${formatResponsiveTier(level.desktop, indentLevel + 2)},`, indentLevel + 1),
        ];
        return `${indent(`${id}: (`, indentLevel)}\n${inner.join('\n')}\n${indent('),', indentLevel)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatTextSizeMap(sizes: TextSizeConfig[], indentLevel: number): string {
    const entries = sizes.map((size, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${size['font-size']},`, indentLevel + 1),
            indent(`"line-height": ${size['line-height']},`, indentLevel + 1),
            indent(`"mobile": ${formatResponsiveTier(size.mobile, indentLevel + 2)},`, indentLevel + 1),
            indent(`"desktop": ${formatResponsiveTier(size.desktop, indentLevel + 2)},`, indentLevel + 1),
        ];
        return `${indent(`${id}: (`, indentLevel)}\n${inner.join('\n')}\n${indent('),', indentLevel)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatParagraphSizeMap(sizes: ParagraphSizeConfig[], indentLevel: number): string {
    const entries = sizes.map((size, i) => {
        const id = i + 1;
        const inner = [
            indent(`"font-size": ${size['font-size']},`, indentLevel + 1),
            indent(`"line-height": ${size['line-height']},`, indentLevel + 1),
            indent(`"margin-bottom": ${size['margin-bottom']},`, indentLevel + 1),
            indent(`"mobile": ${formatResponsiveTier(size.mobile, indentLevel + 2)},`, indentLevel + 1),
            indent(`"desktop": ${formatResponsiveTier(size.desktop, indentLevel + 2)},`, indentLevel + 1),
        ];
        return `${indent(`${id}: (`, indentLevel)}\n${inner.join('\n')}\n${indent('),', indentLevel)}`;
    });
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function formatWeightsMap(weights: Record<string, number>, indentLevel: number): string {
    const entries = Object.entries(weights)
        .map(([k, v]) => indent(`"${k}": ${v},`, indentLevel));
    return `(\n${entries.join('\n')}\n${indent(')', indentLevel - 1)}`;
}

function generate(): string {
    const lines: string[] = [
        '// Auto-generated from @reformjs/reactive config defaults.',
        '// Do not edit manually. To customize, create your own configuration file.',
        '',
    ];

    const config = DEFAULT_CONFIG;

    // Palette colors
    for (const [name, shades] of Object.entries(config.palette.colors)) {
        lines.push(`$ra-config-palette-color-${name}: ${formatPaletteMap(shades, 2)};`);
        lines.push('');
    }

    // Interactive design schemes
    for (const [name, scheme] of Object.entries(config.interactiveDesigns.schemes)) {
        lines.push(`$ra-config-interactive-color-${name}-base: ${formatInteractiveVariant(scheme.base, 2)};`);
        lines.push('');
        lines.push(`$ra-config-interactive-color-${name}-fill: ${formatInteractiveVariant(scheme.fill, 2)};`);
        lines.push('');
        lines.push(`$ra-config-interactive-color-${name}: (`);
        lines.push(`${indent('"": $ra-config-interactive-color-' + name + '-base,', 1)}`);
        lines.push(`${indent('"fill": $ra-config-interactive-color-' + name + '-fill,', 1)}`);
        lines.push(');');
        lines.push('');
    }

    // Grayscale
    for (const [key, value] of Object.entries(config.grayscale)) {
        if (key === 'transparent') continue; // transparent is not a configurable color
        const varName = key === 'white' ? '$clr-white' :
                        key === 'black' ? '$clr-black' :
                        `$clr-${key}`;
        lines.push(`${varName}: ${value};`);
    }
    lines.push('');

    // Base typography
    lines.push(`$ra-config-default-font-size: ${config.base.fontSize};`);
    lines.push(`$ra-config-default-font-weight: ${config.base.fontWeight};`);
    lines.push('');

    // Input settings
    lines.push(`$ra-config-inputs-focus-color: ${config.inputs.focusColor};`);
    lines.push(`$ra-config-inputs-border-radius: ${config.inputs.borderRadius};`);
    lines.push(`$ra-config-inputs-border-width: ${config.inputs.borderWidth};`);
    lines.push(`$ra-config-inputs-focused-border-width: ${config.inputs.focusedBorderWidth};`);
    lines.push(`$ra-config-input-container-default-variant: ${formatFieldContainerVariant(config.inputs.containerDefault, 2)};`);
    lines.push('');

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
        const value = config.tabs[key];
        const formatted = value === null ? 'null' :
                          typeof value === 'string' && key === 'cornerStyle' ? `'${value}'` :
                          String(value);
        lines.push(`${varName}: ${formatted};`);
    }
    lines.push('');

    // Layout breakpoints
    lines.push(`$ra-config-resp-breakpoints: ${config.layout.breakpoints.join(', ')};`);
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
    lines.push('');

    // Typography settings
    const typo = config.typography;

    lines.push(`$ra-config-typography-heading-color: ${typo.heading.color};`);
    lines.push(`$ra-config-typography-heading-font-weight: ${typo.heading['font-weight']};`);
    lines.push(`$ra-config-typography-heading-levels: ${formatLevelMap(typo.heading.levels, 1)};`);
    lines.push('');

    lines.push(`$ra-config-typography-sub-heading-color: ${typo.subHeading.color};`);
    lines.push(`$ra-config-typography-sub-heading-font-weight: ${typo.subHeading['font-weight']};`);
    lines.push(`$ra-config-typography-sub-heading-levels: ${formatLevelMap(typo.subHeading.levels, 1)};`);
    lines.push('');

    lines.push(`$ra-config-typography-text-color: ${typo.text.color};`);
    lines.push(`$ra-config-typography-text-font-weight: ${typo.text['font-weight']};`);
    lines.push(`$ra-config-typography-text-sizes: ${formatTextSizeMap(typo.text.sizes, 1)};`);
    lines.push('');

    lines.push(`$ra-config-typography-paragraph-color: ${typo.paragraph.color};`);
    lines.push(`$ra-config-typography-paragraph-font-weight: ${typo.paragraph['font-weight']};`);
    lines.push(`$ra-config-typography-paragraph-sizes: ${formatParagraphSizeMap(typo.paragraph.sizes, 1)};`);
    lines.push('');

    lines.push(`$ra-config-typography-caption-font-size: ${typo.caption['font-size']};`);
    lines.push(`$ra-config-typography-caption-line-height: ${typo.caption['line-height']};`);
    lines.push(`$ra-config-typography-caption-color: ${typo.caption.color};`);
    lines.push(`$ra-config-typography-caption-font-weight: ${typo.caption['font-weight']};`);
    lines.push('');

    lines.push(`$ra-config-typography-overline-font-size: ${typo.overline['font-size']};`);
    lines.push(`$ra-config-typography-overline-line-height: ${typo.overline['line-height']};`);
    lines.push(`$ra-config-typography-overline-color: ${typo.overline.color};`);
    lines.push(`$ra-config-typography-overline-font-weight: ${typo.overline['font-weight']};`);
    lines.push('');

    lines.push(`$ra-config-typography-weights: ${formatWeightsMap(typo.weights, 1)};`);
    lines.push('');

    // Button settings
    lines.push(`$ra-config-button-default-variant: ${formatButtonVariant(config.button.defaultVariant, 2)};`);
    lines.push('');

    return lines.join('\n');
}

// Write to dist
const outputPath = path.join(process.cwd(), 'dist/styles/scss/defaults.scss');
const content = generate();
fs.writeFileSync(outputPath, content, 'utf-8');
console.log(`Generated ${outputPath}`);
