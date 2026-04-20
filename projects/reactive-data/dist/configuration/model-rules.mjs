import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { mapValues } from 'lodash-es';
import ModelRule from './model-rule.mjs';

var _ModelRules_rules;
class ModelRules {
    constructor(modelRules, triggersModel) {
        _ModelRules_rules.set(this, void 0);
        __classPrivateFieldSet(this, _ModelRules_rules, mapValues(modelRules, (modelRule) => new ModelRule(modelRule, triggersModel)), "f");
    }
    getRules() {
        return __classPrivateFieldGet(this, _ModelRules_rules, "f");
    }
}
_ModelRules_rules = new WeakMap();

export { ModelRules as default };
