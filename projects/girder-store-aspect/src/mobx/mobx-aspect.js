import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';

class MobxAspect extends Aspect {
    constructor() {
        super('mobx');
    }

    onInitialize(initContext) {
        super.onInitialize(initContext);

        const {
            hooks,
            setControls,
        } = initContext;

        const stores = [];

        forEach(hooks.mobx, (hook) => {
            forEach(hook.stores, (store) => {
                const storeId = store.id;

                if (!isNil(stores[storeId])) {
                    throw new Error(`A store by the id of ${storeId} already exists.`);
                }

                stores[storeId] = store.create();
            });
        });

        const controls = {
            getStore: (storeId) => stores[storeId],
        };

        setControls(controls);
    }
}

export default MobxAspect;