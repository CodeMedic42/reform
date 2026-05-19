import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { isNil, toPath, reduce, forEach, keys } from 'lodash-es';
import { State, getHighestState } from './state-constant.mjs';

var _DataControl_dataInterface, _DataControl_onChangedAtListeners, _DataControl_onChangeListeners, _DataControl_onInternalChangeEndListeners, _DataControl_lastUsedListenerId, _DataControl_rootPropertyAccess, _DataControl_state, _DataControl_onStateChangeListeners, _DataControl_propertyStates, _DataControl_invalidProperties;
const LISTENERS = Symbol('listeners');
class DataControl {
    constructor(configuration, initial) {
        _DataControl_dataInterface.set(this, void 0);
        _DataControl_onChangedAtListeners.set(this, {});
        _DataControl_onChangeListeners.set(this, {});
        _DataControl_onInternalChangeEndListeners.set(this, {});
        _DataControl_lastUsedListenerId.set(this, 0);
        _DataControl_rootPropertyAccess.set(this, void 0);
        _DataControl_state.set(this, State.idle);
        _DataControl_onStateChangeListeners.set(this, {});
        _DataControl_propertyStates.set(this, {});
        _DataControl_invalidProperties.set(this, {});
        __classPrivateFieldSet(this, _DataControl_rootPropertyAccess, configuration.getModel().build({
            initial,
            dataControl: this,
            path: [],
        }), "f");
    }
    async initialize() {
        await __classPrivateFieldGet(this, _DataControl_rootPropertyAccess, "f").initialize();
    }
    async finalize(data) {
        __classPrivateFieldSet(this, _DataControl_dataInterface, data, "f");
    }
    getInterface() {
        if (isNil(__classPrivateFieldGet(this, _DataControl_dataInterface, "f"))) {
            throw new Error('DataControl not finalized yet');
        }
        return __classPrivateFieldGet(this, _DataControl_dataInterface, "f");
    }
    onChange(cb) {
        var _a, _b;
        const usedId = (__classPrivateFieldSet(this, _DataControl_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _DataControl_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _DataControl_onChangeListeners, "f")[usedId] = cb;
        return () => {
            delete __classPrivateFieldGet(this, _DataControl_onChangeListeners, "f")[usedId];
        };
    }
    onChangedAt(path, cb) {
        var _a, _b;
        const segments = toPath(path);
        const target = reduce(segments, (acc, segment) => {
            let child = acc[segment];
            if (isNil(child)) {
                child = {};
                acc[segment] = child;
            }
            return child;
        }, __classPrivateFieldGet(this, _DataControl_onChangedAtListeners, "f"));
        if (isNil(target[LISTENERS])) {
            target[LISTENERS] = {};
        }
        const usedId = (__classPrivateFieldSet(this, _DataControl_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _DataControl_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        target[LISTENERS][usedId] = cb;
        return () => {
            delete target[LISTENERS][usedId];
        };
    }
    changed(propertyAccess) {
        forEach(__classPrivateFieldGet(this, _DataControl_onChangeListeners, "f"), (listener) => {
            listener(propertyAccess);
        });
    }
    changedAt(propertyAccess) {
        let listenersGroup = __classPrivateFieldGet(this, _DataControl_onChangedAtListeners, "f");
        forEach(propertyAccess.getPath(), (segment) => {
            listenersGroup = listenersGroup[segment];
            if (isNil(listenersGroup)) {
                return false;
            }
            return true;
        });
        if (!isNil(listenersGroup)) {
            forEach(listenersGroup[LISTENERS], (listener) => {
                listener(propertyAccess);
            });
        }
    }
    getPropertyAccessAt(path) {
        return __classPrivateFieldGet(this, _DataControl_rootPropertyAccess, "f").getPropertyAccessAt(path);
    }
    onStateChange(listener) {
        var _a, _b;
        const id = (__classPrivateFieldSet(this, _DataControl_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _DataControl_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _DataControl_onStateChangeListeners, "f")[id] = listener;
        return () => {
            delete __classPrivateFieldGet(this, _DataControl_onStateChangeListeners, "f")[id];
        };
    }
    stateChangedAt(propertyAccess, previousPropertyState) {
        const state = propertyAccess.getState();
        if (state === State.idle) {
            if (propertyAccess.isValid()) {
                delete __classPrivateFieldGet(this, _DataControl_invalidProperties, "f")[propertyAccess.getUuid()];
            }
            else {
                __classPrivateFieldGet(this, _DataControl_invalidProperties, "f")[propertyAccess.getUuid()] = propertyAccess;
            }
        }
        if (!isNil(__classPrivateFieldGet(this, _DataControl_propertyStates, "f")[previousPropertyState])) {
            delete __classPrivateFieldGet(this, _DataControl_propertyStates, "f")[previousPropertyState][propertyAccess.getUuid()];
            if (keys(__classPrivateFieldGet(this, _DataControl_propertyStates, "f")[previousPropertyState]).length <= 0) {
                delete __classPrivateFieldGet(this, _DataControl_propertyStates, "f")[previousPropertyState];
            }
        }
        if (isNil(__classPrivateFieldGet(this, _DataControl_propertyStates, "f")[state])) {
            __classPrivateFieldGet(this, _DataControl_propertyStates, "f")[state] = {};
        }
        __classPrivateFieldGet(this, _DataControl_propertyStates, "f")[state][propertyAccess.getUuid()] = true;
        // get highest overall state of all rules
        const highest = getHighestState(keys(__classPrivateFieldGet(this, _DataControl_propertyStates, "f")));
        // The state for the property has changed if this is true.
        if (__classPrivateFieldGet(this, _DataControl_state, "f") === highest) {
            return;
        }
        const previousState = __classPrivateFieldGet(this, _DataControl_state, "f");
        __classPrivateFieldSet(this, _DataControl_state, highest, "f");
        forEach(__classPrivateFieldGet(this, _DataControl_onStateChangeListeners, "f"), (listener) => listener(__classPrivateFieldGet(this, _DataControl_state, "f"), previousState));
    }
    onInternalChangeEnd(listener) {
        var _a, _b;
        const id = (__classPrivateFieldSet(this, _DataControl_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _DataControl_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _DataControl_onInternalChangeEndListeners, "f")[id] = listener;
        return () => {
            delete __classPrivateFieldGet(this, _DataControl_onInternalChangeEndListeners, "f")[id];
        };
    }
    isValid() {
        return keys(__classPrivateFieldGet(this, _DataControl_invalidProperties, "f")).length <= 0;
    }
    async validate() {
        await __classPrivateFieldGet(this, _DataControl_rootPropertyAccess, "f").validate();
    }
}
_DataControl_dataInterface = new WeakMap(), _DataControl_onChangedAtListeners = new WeakMap(), _DataControl_onChangeListeners = new WeakMap(), _DataControl_onInternalChangeEndListeners = new WeakMap(), _DataControl_lastUsedListenerId = new WeakMap(), _DataControl_rootPropertyAccess = new WeakMap(), _DataControl_state = new WeakMap(), _DataControl_onStateChangeListeners = new WeakMap(), _DataControl_propertyStates = new WeakMap(), _DataControl_invalidProperties = new WeakMap();

export { DataControl as default };
