import { DEFAULT_CONFIG } from '@reformjs/reactive/config/defaults';

const STORAGE_KEY = 'ra-config-panel-state-v4';

function loadConfigState(): any {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed?.config ?? parsed;
        }
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

export function getButtonDesignOptions(): string[] {
    const config = loadConfigState();
    if (!config?.button) return Object.keys(DEFAULT_CONFIG.button.designs);

    return Object.keys(config.button.designs ?? {});
}

export function getInteractiveVariantOptions(): string[] {
    const config = loadConfigState();
    const schemes = config?.interactiveDesigns?.schemes ?? DEFAULT_CONFIG.interactiveDesigns.schemes;
    const custom = config?.interactiveDesigns?.custom ?? {};
    const variants = new Set<string>();
    [...Object.values(schemes), ...Object.values(custom)].forEach((scheme) => {
        Object.keys((scheme as any)?.variants ?? {}).forEach((name) => {
            variants.add(name);
        });
    });
    return [...variants];
}
