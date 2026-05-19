import { DEFAULT_CONFIG } from '@reformjs/reactive/config/defaults';

const STORAGE_KEY = 'ra-config-panel-state';

function loadConfigState(): any {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        // ignore
    }
    return null;
}

export function getPaletteColorOptions(): string[] {
    const config = loadConfigState();
    if (!config?.palette) return Object.keys(DEFAULT_CONFIG.palette.colors);

    const defaultColors = Object.keys(config.palette.colors ?? {});
    const customColors = Object.keys(config.palette.custom ?? {});
    return [...defaultColors, ...customColors];
}

export function getInteractiveColorOptions(): string[] {
    const config = loadConfigState();
    if (!config?.interactiveDesigns) {
        return Object.keys(DEFAULT_CONFIG.interactiveDesigns.schemes).filter((k) => k !== 'default');
    }

    const defaultSchemes = Object.keys(config.interactiveDesigns.schemes ?? {}).filter((k) => k !== 'default');
    const customSchemes = Object.keys(config.interactiveDesigns.custom ?? {});
    return [...defaultSchemes, ...customSchemes];
}

export function getButtonVariantOptions(): string[] {
    const config = loadConfigState();
    if (!config?.button) return [];

    return Object.keys(config.button.variants ?? {});
}

export function getInteractiveDesignOptions(): string[] {
    return ['fill'];
}
