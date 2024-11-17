import Fluxible from 'fluxible';
import { Aspect } from '@reformjs/girder';
import forEach from 'lodash/forEach';

class FluxibleAspect extends Aspect {
    constructor() {
        super('fluxible');
    }

    onInitialize(config) {
        const {
            getSettings,
        } = config;

        const settings = getSettings('fluxible');

        const stores = [];

        forEach(settings, (setting) => {
            stores.push(...setting.stores);
        });

        const app = new Fluxible({
            stores,
        });

        this.context = app.createContext();
    }
}

export default FluxibleAspect;