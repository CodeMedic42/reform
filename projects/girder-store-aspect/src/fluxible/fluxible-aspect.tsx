import Fluxible from 'fluxible';
import { Aspect, type AspectInitContext } from '@reformjs/girder';
import { forEach } from 'lodash-es';

interface FluxibleSetting {
    stores: unknown[];
}

class FluxibleAspect extends Aspect {
    context: ReturnType<Fluxible['createContext']> | undefined;

    constructor() {
        super('fluxible');
    }

    onInitialize(config?: AspectInitContext): void {
        const {
            getSettings,
        } = config!;

        const settings = getSettings('fluxible') as FluxibleSetting[];

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
