import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';

class MobxAspect extends Aspect {
    constructor() {
        super('mobx');
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize(config) {
        const { getSettings } = config;

        const settings = getSettings('mobx');

        const stores = [];

        forEach(settings, (setting) => {
            forEach(setting.stores, (store) => {
                const storeId = store.id;

                if (!isNil(stores[storeId])) {
                    throw new Error(`A store by the id of ${storeId} already exists.`);
                }

                stores[storeId] = store.create();
            });
        });

        return {
            getStore: (storeId) => stores[storeId],
        };
    }
}

export default MobxAspect;