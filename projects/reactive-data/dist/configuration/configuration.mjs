import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { isNil } from 'lodash-es';
import { buildModel } from './model-registry.mjs';
import TriggersModel from './triggers-model.mjs';
import './object-model.mjs';
import './array-model.mjs';
import './simple-model.mjs';

var _Configuration_model, _Configuration_triggers;
class Configuration {
    constructor(configuration) {
        _Configuration_model.set(this, void 0);
        _Configuration_triggers.set(this, void 0);
        if (isNil(configuration)) {
            throw new Error('No configuration detected.');
        }
        __classPrivateFieldSet(this, _Configuration_triggers, new TriggersModel(configuration.triggers), "f");
        __classPrivateFieldSet(this, _Configuration_model, buildModel(configuration.model, __classPrivateFieldGet(this, _Configuration_triggers, "f")), "f");
    }
    getModel() {
        return __classPrivateFieldGet(this, _Configuration_model, "f");
    }
    getTriggers() {
        return __classPrivateFieldGet(this, _Configuration_triggers, "f");
    }
}
_Configuration_model = new WeakMap(), _Configuration_triggers = new WeakMap();

export { Configuration as default };
