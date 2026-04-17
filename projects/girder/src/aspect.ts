import isString from 'lodash/isString';

export interface AspectSettings {
    [settingId: string]: unknown;
}

export interface AspectInitContext {
    getAspect: (aspectId: string) => unknown;
    getSettings: (settingId: string) => unknown[];
    stopClient: () => Promise<void>;
}

export interface AspectStartContext {
    getAspect: (aspectId: string) => unknown;
    [aspectId: string]: unknown;
}

/* eslint-disable class-methods-use-this */
class Aspect {
    private aspectId: string;

    constructor(aspectId: string) {
        if (!isString(aspectId)) {
            throw new Error('An Aspect must have an id.');
        }

        this.aspectId = aspectId;
    }

    get id(): string {
        return this.aspectId;
    }

    settings(): AspectSettings | null {
        return null;
    }

    onInitialize(_context?: AspectInitContext): unknown | void {}

    onStart(_context?: AspectStartContext): void {}

    onStop(): void | Promise<void> {}

    getControls(): unknown | null {
        return null;
    }
}

export default Aspect;
