import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from '../src/config/defaults.js';
import type { PaletteShades, InteractiveVariant, InteractiveScheme, ButtonVariant, FieldContainerVariant } from '../src/config/types.js';

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

function generate(): string {
    const lines: string[] = [
        '// Auto-generated from @reformjs/reactive config defaults.',
        '// Do not edit manually. To customize, create your own configuration file.',
        '',
    ];

    const config = DEFAULT_CONFIG;

    // Palette colors
    for (const [name, shades] of Object.entries(config.palette.colors)) {
        lines.push(`$--ra-config-palette-color-${name}: ${formatPaletteMap(shades, 2)};`);
        lines.push('');
    }

    // Interactive design schemes
    for (const [name, scheme] of Object.entries(config.interactiveDesigns.schemes)) {
        lines.push(`$--ra-config-interactive-color-${name}-base: ${formatInteractiveVariant(scheme.base, 2)};`);
        lines.push('');
        lines.push(`$--ra-config-interactive-color-${name}-fill: ${formatInteractiveVariant(scheme.fill, 2)};`);
        lines.push('');
        lines.push(`$--ra-config-interactive-color-${name}: (`);
        lines.push(`${indent('"": $--ra-config-interactive-color-' + name + '-base,', 1)}`);
        lines.push(`${indent('"fill": $--ra-config-interactive-color-' + name + '-fill,', 1)}`);
        lines.push(');');
        lines.push('');
    }

    // Grayscale
    for (const [key, value] of Object.entries(config.grayscale)) {
        if (key === 'transparent') continue; // transparent is not a configurable color
        const varName = key === 'white' ? '$--clr-white' :
                        key === 'black' ? '$--clr-black' :
                        `$--clr-${key}`;
        lines.push(`${varName}: ${value};`);
    }
    lines.push('');

    // Base typography
    lines.push(`$--ra-config-default-font-size: ${config.base.fontSize};`);
    lines.push(`$--ra-config-default-font-weight: ${config.base.fontWeight};`);
    lines.push('');

    // Input settings
    lines.push(`$--ra-config-inputs-focus-color: ${config.inputs.focusColor};`);
    lines.push(`$--ra-config-inputs-border-radius: ${config.inputs.borderRadius};`);
    lines.push(`$--ra-config-inputs-border-width: ${config.inputs.borderWidth};`);
    lines.push(`$--ra-config-inputs-focused-border-width: ${config.inputs.focusedBorderWidth};`);
    lines.push(`$--ra-config-input-container-default-variant: ${formatFieldContainerVariant(config.inputs.containerDefault, 2)};`);
    lines.push('');

    // Tab settings
    const tabFields: [keyof typeof config.tabs, string][] = [
        ['cornerStyle', '$--ra-config-tab-corner-style'],
        ['innerBorder', '$--ra-config-tab-inner-border'],
        ['outerBorder', '$--ra-config-tab-outer-border'],
        ['borderRadius', '$--ra-config-tab-border-radius'],
        ['textColor', '$--ra-config-tab-text-color'],
        ['bgColor', '$--ra-config-tab-bg-color'],
        ['verticalPadding', '$--ra-config-tab-vertical-padding'],
        ['horizontalPadding', '$--ra-config-tab-horizontal-padding'],
        ['fontSize', '$--ra-config-tab-font-size'],
        ['fontWeight', '$--ra-config-tab-font-weight'],
        ['lineHeight', '$--ra-config-tab-line-height'],
        ['activeTextColor', '$--ra-config-tab-active-text-color'],
        ['activeBgColor', '$--ra-config-tab-active-bg-color'],
        ['activeVerticalPadding', '$--ra-config-tab-active-vertical-padding'],
        ['activeHorizontalPadding', '$--ra-config-tab-active-horizontal-padding'],
        ['activeFontSize', '$--ra-config-tab-active-font-size'],
        ['activeFontWeight', '$--ra-config-tab-active-font-weight'],
        ['activeLineHeight', '$--ra-config-tab-active-line-height'],
        ['disabledTextColor', '$--ra-config-tab-disabled-text-color'],
        ['disabledBgColor', '$--ra-config-tab-disabled-bg-color'],
        ['disabledVerticalPadding', '$--ra-config-tab-disabled-vertical-padding'],
        ['disabledHorizontalPadding', '$--ra-config-tab-disabled-horizontal-padding'],
        ['disabledFontSize', '$--ra-config-tab-disabled-font-size'],
        ['disabledFontWeight', '$--ra-config-tab-disabled-font-weight'],
        ['disabledLineHeight', '$--ra-config-tab-disabled-line-height'],
        ['bottomBgColor', '$--ra-config-tab-bottom-bg-color'],
        ['bottomPaddingTop', '$--ra-config-tab-bottom-padding-top'],
        ['bottomPaddingBottom', '$--ra-config-tab-bottom-padding-bottom'],
        ['bottomPaddingLeft', '$--ra-config-tab-bottom-padding-left'],
        ['bottomPaddingRight', '$--ra-config-tab-bottom-padding-right'],
        ['bottomBorderRadius', '$--ra-config-tab-bottom-border-radius'],
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
    lines.push(`$-ra-config-resp-breakpoints: ${config.layout.breakpoints.join(', ')};`);
    lines.push('');

    // Button settings
    lines.push(`$--ra-config-button-default-variant: ${formatButtonVariant(config.button.defaultVariant, 2)};`);
    lines.push('');

    return lines.join('\n');
}

// Write to dist
const outputPath = path.join(process.cwd(), 'dist/styles/scss/defaults.scss');
const content = generate();
fs.writeFileSync(outputPath, content, 'utf-8');
console.log(`Generated ${outputPath}`);
