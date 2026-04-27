import type { ConfigState } from './types';
import { STORAGE_KEY } from './constants';
import { DEFAULT_CONFIG } from './defaults';

export interface RemovedDefaults {
    paletteColors: string[];
    interactiveSchemes: string[];
}

export interface ConfigPanelState {
    config: ConfigState;
    removedDefaults: RemovedDefaults;
}

const EMPTY_REMOVED: RemovedDefaults = {
    paletteColors: [],
    interactiveSchemes: [],
};

export function loadPanelState(): ConfigPanelState {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Support old format (just ConfigState without removedDefaults)
            if (parsed.removedDefaults) {
                return parsed as ConfigPanelState;
            }
            return { config: parsed as ConfigState, removedDefaults: { ...EMPTY_REMOVED } };
        }
    } catch {
        // ignore parse errors
    }
    return {
        config: structuredClone(DEFAULT_CONFIG),
        removedDefaults: { ...EMPTY_REMOVED },
    };
}

export function loadConfig(): ConfigState {
    return loadPanelState().config;
}

export function savePanelState(state: ConfigPanelState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // ignore storage errors
    }
}

export function saveConfig(config: ConfigState): void {
    const current = loadPanelState();
    savePanelState({ ...current, config });
}

export function clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
}
