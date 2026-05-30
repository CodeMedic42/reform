import type { ConfigState, PaletteRef, PaletteShades } from '../types';

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

export function buildPaletteMap(config: ConfigState): PaletteMap {
    return { ...config.palette.colors, ...config.palette.custom };
}
