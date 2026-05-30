import type { PaletteRef, PaletteShades } from './types.js';

export type PaletteMap = Record<string, PaletteShades>;

export function resolvePaletteRef(ref: PaletteRef, palettes: PaletteMap): string {
    if (ref === 'transparent') {
        return 'transparent';
    }
    const palette = palettes[ref.palette];
    if (!palette) {
        return 'transparent';
    }
    return palette[ref.shade];
}
