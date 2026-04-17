import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import ModelRules from './model-rules.mjs';
import ModelMeta from './model-meta.mjs';

var _BaseModel_type, _BaseModel_meta, _BaseModel_rules, _BaseModel_triggers;
class BaseModel {
    constructor(modelDef, triggersModel) {
        _BaseModel_type.set(this, void 0);
        _BaseModel_meta.set(this, void 0);
        _BaseModel_rules.set(this, void 0);
        _BaseModel_triggers.set(this, void 0);
        __classPrivateFieldSet(this, _BaseModel_type, modelDef.type, "f");
        __classPrivateFieldSet(this, _BaseModel_rules, new ModelRules(modelDef.rules, triggersModel), "f");
        __classPrivateFieldSet(this, _BaseModel_meta, new ModelMeta(modelDef.meta), "f");
        __classPrivateFieldSet(this, _BaseModel_triggers, triggersModel.merge(modelDef.triggers), "f");
    }
    getType() {
        return __classPrivateFieldGet(this, _BaseModel_type, "f");
    }
    getMeta() {
        return __classPrivateFieldGet(this, _BaseModel_meta, "f") || {};
    }
    getRules() {
        return __classPrivateFieldGet(this, _BaseModel_rules, "f");
    }
    getTriggers() {
        return __classPrivateFieldGet(this, _BaseModel_triggers, "f");
    }
}
_BaseModel_type = new WeakMap(), _BaseModel_meta = new WeakMap(), _BaseModel_rules = new WeakMap(), _BaseModel_triggers = new WeakMap();

export { BaseModel as default };
