import type { ConfigState, VariantStateSlots, VariantStates } from '../types';
import { buildPaletteMap, resolvePaletteRef } from '../util/resolve-palette-ref';

const COLOR_STYLE_ID = 'ra-config-colors';
const STATE_KEYS: (keyof VariantStates)[] = ['default', 'hover', 'focus', 'active', 'disabled'];
const SLOT_KEYS: (keyof VariantStateSlots)[] = ['clr', 'bg', 'br', 'out'];

function statePrefix(state: keyof VariantStates): string {
    return state === 'default' ? '' : `${state}-`;
}

export function applyColors(config: ConfigState): void {
    let styleEl = document.getElementById(COLOR_STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = COLOR_STYLE_ID;
        document.head.appendChild(styleEl);
    }

    const palettes = buildPaletteMap(config);
    const rules: string[] = [];

    for (const [name, shades] of Object.entries(palettes)) {
        const props = [100, 200, 300, 400, 500, 600, 700, 800, 900]
            .map((shade) => `  --clr-plt-${shade}: ${shades[shade as keyof typeof shades]};`)
            .join('\n');
        rules.push(`.ra-clr-plt-${name} {\n${props}\n}`);
    }

    const allSchemes = { ...config.interactiveDesigns.schemes, ...config.interactiveDesigns.custom };
    for (const [name, scheme] of Object.entries(allSchemes)) {
        const variantProps: string[] = [];

        for (const [variantName, states] of Object.entries(scheme.variants)) {
            const variantPrefix = variantName === 'base' ? '' : `-${variantName}`;
            for (const state of STATE_KEYS) {
                const slots = states[state];
                if (!slots) continue;
                const sp = statePrefix(state);
                for (const slot of SLOT_KEYS) {
                    const ref = slots[slot];
                    if (ref === undefined) continue;
                    const resolved = resolvePaletteRef(ref, palettes);
                    variantProps.push(`  --ra-int${variantPrefix}-${sp}${slot}: ${resolved};`);
                }
            }
        }

        if (name === 'default') {
            rules.push(`:root {\n${variantProps.join('\n')}\n}`);
        } else {
            rules.push(`.ra-clr-int.ra-clr-int-${name} {\n${variantProps.join('\n')}\n}`);
        }
    }

    styleEl.textContent = rules.join('\n\n');
}
