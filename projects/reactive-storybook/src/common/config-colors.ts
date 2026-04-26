const STORAGE_KEY = 'ra-config-panel-state';

const DEFAULT_PALETTE_COLORS = ['blue', 'purple', 'green', 'yellow', 'orange', 'red'];
const DEFAULT_INTERACTIVE_COLORS = ['primary', 'secondary', 'info', 'success', 'warn', 'danger'];
const DEFAULT_BUTTON_VARIANTS: string[] = [];
const DEFAULT_INTERACTIVE_DESIGNS = ['fill'];

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
    if (!config?.palette) return DEFAULT_PALETTE_COLORS;

    const defaultColors = Object.keys(config.palette.colors ?? {});
    const customColors = Object.keys(config.palette.custom ?? {});
    return [...defaultColors, ...customColors];
}

export function getInteractiveColorOptions(): string[] {
    const config = loadConfigState();
    if (!config?.interactiveDesigns) return DEFAULT_INTERACTIVE_COLORS;

    const defaultSchemes = Object.keys(config.interactiveDesigns.schemes ?? {}).filter((k) => k !== 'default');
    const customSchemes = Object.keys(config.interactiveDesigns.custom ?? {});
    return [...defaultSchemes, ...customSchemes];
}

export function getButtonVariantOptions(): string[] {
    const config = loadConfigState();
    if (!config?.button) return DEFAULT_BUTTON_VARIANTS;

    return Object.keys(config.button.variants ?? {});
}

export function getInteractiveDesignOptions(): string[] {
    return DEFAULT_INTERACTIVE_DESIGNS;
}
