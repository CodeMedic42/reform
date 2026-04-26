import type { ConfigState } from './types';
import { STORAGE_KEY } from './constants';
import { DEFAULT_CONFIG } from './defaults';

export function loadConfig(): ConfigState {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as ConfigState;
        }
    } catch {
        // ignore parse errors
    }
    return structuredClone(DEFAULT_CONFIG);
}

export function saveConfig(config: ConfigState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        // ignore storage errors
    }
}

export function clearConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
}
