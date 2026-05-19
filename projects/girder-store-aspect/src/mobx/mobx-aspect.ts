import { isNil, forEach } from 'lodash-es';
import { Aspect, type AspectInitContext } from '@reformjs/girder';

interface MobxStoreInstance {
    id: string;
    create(): unknown;
}

interface MobxSetting {
    stores: MobxStoreInstance[];
}

interface MobxAspectResult {
    getStore: (storeId: string) => unknown;
}

class MobxAspect extends Aspect {
    constructor() {
        super('mobx');
    }

    onInitialize(config?: AspectInitContext): MobxAspectResult {
        const { getSettings } = config!;

        const settings = getSettings('mobx') as MobxSetting[];

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
