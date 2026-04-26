import type { ConfigState } from '../types';

const COLOR_STYLE_ID = 'ra-config-colors';

export function applyColors(config: ConfigState): void {
    let styleEl = document.getElementById(COLOR_STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = COLOR_STYLE_ID;
        document.head.appendChild(styleEl);
    }

    const rules: string[] = [];

    // Grayscale on :root
    const grayscaleProps = Object.entries(config.grayscale)
        .map(([key, value]) => {
            const cssVar = key === 'white' ? '--clr-white' :
                           key === 'black' ? '--clr-black' :
                           key === 'transparent' ? '--clr-transparent' :
                           `--clr-${key}`;
            return `  ${cssVar}: ${value};`;
        })
        .join('\n');
    rules.push(`:root {\n${grayscaleProps}\n}`);

    // Palette colors
    const allPaletteColors = { ...config.palette.colors, ...config.palette.custom };
    for (const [name, shades] of Object.entries(allPaletteColors)) {
        const props = [100, 200, 300, 400, 500, 600, 700, 800, 900]
            .map((shade) => `  --clr-plt-${shade}: ${shades[shade as keyof typeof shades]};`)
            .join('\n');
        rules.push(`.ra-clr-plt-${name} {\n${props}\n}`);
    }

    // Interactive design colors
    const allSchemes = { ...config.interactiveDesigns.schemes, ...config.interactiveDesigns.custom };
    for (const [name, scheme] of Object.entries(allSchemes)) {
        const variantProps: string[] = [];

        for (const [variantName, variant] of Object.entries({ '': scheme.base, fill: scheme.fill })) {
            const prefix = variantName ? `-${variantName}` : '';
            for (const [prop, value] of Object.entries(variant)) {
                if (value !== undefined) {
                    variantProps.push(`  --ra-int${prefix}-${prop}: ${value};`);
                }
            }
        }

        if (name === 'default') {
            // Default scheme goes on :root
            rules.push(`:root {\n${variantProps.join('\n')}\n}`);
        } else {
            rules.push(`.ra-clr-int.ra-clr-int-${name} {\n${variantProps.join('\n')}\n}`);
        }
    }

    styleEl.textContent = rules.join('\n\n');
}
