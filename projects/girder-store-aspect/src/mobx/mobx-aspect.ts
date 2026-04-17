import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';

interface MobxStoreInstance {
    id: string;
    create(): unknown;
}

interface MobxSetting {
    stores: MobxStoreInstance[];
}

interface MobxConfig {
    getSettings: (key: string) => MobxSetting[];
}

interface MobxAspectResult {
    getStore: (storeId: string) => unknown;
}

class MobxAspect extends Aspect {
    constructor() {
        super('mobx');
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize(config: MobxConfig): MobxAspectResult {
        const { getSettings } = config;

        const settings: MobxSetting[] = getSettings('mobx');

        const stores: Record<string, unknown> = {};

        forEach(settings, (setting: MobxSetting) => {
            forEach(setting.stores, (store: MobxStoreInstance) => {
                const storeId: string = store.id;

                if (!isNil(stores[storeId])) {
                    throw new Error(`A store by the id of ${storeId} already exists.`);
                }

                stores[storeId] = store.create();
            });
        });

        return {
            getStore: (storeId: string): unknown => stores[storeId],
        };
    }
}

export default MobxAspect;
