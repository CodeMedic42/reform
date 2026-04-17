import Fluxible from 'fluxible';
import { Aspect } from '@reformjs/girder';
import forEach from 'lodash/forEach';

interface FluxibleSetting {
    stores: unknown[];
}

interface FluxibleConfig {
    getSettings: (key: string) => FluxibleSetting[];
}

class FluxibleAspect extends Aspect {
    context: ReturnType<Fluxible['createContext']> | undefined;

    constructor() {
        super('fluxible');
    }

    onInitialize(config: FluxibleConfig): void {
        const {
            getSettings,
        } = config;

        const settings: FluxibleSetting[] = getSettings('fluxible');

        const stores: unknown[] = [];

        forEach(settings, (setting: FluxibleSetting) => {
            stores.push(...setting.stores);
        });

        const app = new Fluxible({
            stores,
        });

        this.context = app.createContext();
    }
}

export default FluxibleAspect;
