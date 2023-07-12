import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import StoreAspect from '../store-aspect';

class MobxAspect extends StoreAspect {
    constructor() {
        super('mobx');

        this.stores = null;
    }

    state(storeId) {
        return this.stores[storeId];
    }

    dispatch(storeId, action, ...args) {
        this.stores[storeId][action](...args);
    }

    onInitialize(initContext) {
        super.onInitialize(initContext);

        const {
            hooks,
        } = initContext;

        this.stores = [];

        forEach(hooks.mobx, (hook) => {
            forEach(hook.stores, (store) => {
                const storeId = store.id;

                if (!isNil(this.stores[storeId])) {
                    throw new Error(`A store by the id of ${storeId} already exists.`);
                }

                this.stores[storeId] = store.create();
            });
        });
    }

    onStop() {
        super.onStop();

        this.stores = null;
    }
}

export default MobxAspect;