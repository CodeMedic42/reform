import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { merge } from 'lodash-es';

var _TriggersModel_triggers;
class TriggersModel {
    constructor(triggers = {}) {
        _TriggersModel_triggers.set(this, void 0);
        __classPrivateFieldSet(this, _TriggersModel_triggers, triggers, "f");
    }
    triggerOnInitialize() {
        return __classPrivateFieldGet(this, _TriggersModel_triggers, "f").initialize === true;
    }
    triggerOnChange() {
        return __classPrivateFieldGet(this, _TriggersModel_triggers, "f").change === true;
    }
    merge(triggersDef) {
        // If triggersDef is undefined then merge will just use this.#triggers.
        return new TriggersModel(merge({}, __classPrivateFieldGet(this, _TriggersModel_triggers, "f"), triggersDef));
    }
}
_TriggersModel_triggers = new WeakMap();

export { TriggersModel as default };
