import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { map, toPath, isNil, isFunction } from 'lodash-es';

var _ModelRule_requires, _ModelRule_attribute, _ModelRule_enabled, _ModelRule_validator, _ModelRule_triggers;
class ModelRule {
    constructor(rule, triggersModel) {
        _ModelRule_requires.set(this, void 0);
        _ModelRule_attribute.set(this, void 0);
        _ModelRule_enabled.set(this, void 0);
        _ModelRule_validator.set(this, void 0);
        _ModelRule_triggers.set(this, void 0);
        const { requires, attribute, enabled, validator, triggers, } = rule;
        __classPrivateFieldSet(this, _ModelRule_requires, map(requires, (required) => toPath(required)), "f");
        __classPrivateFieldSet(this, _ModelRule_validator, validator, "f");
        if (isNil(attribute)) {
            __classPrivateFieldSet(this, _ModelRule_attribute, undefined, "f");
        }
        else if (isFunction(attribute)) {
            __classPrivateFieldSet(this, _ModelRule_attribute, attribute, "f");
        }
        else {
            __classPrivateFieldSet(this, _ModelRule_attribute, () => attribute, "f");
        }
        if (isNil(enabled)) {
            __classPrivateFieldSet(this, _ModelRule_enabled, () => true, "f");
        }
        else if (!isFunction(enabled)) {
            __classPrivateFieldSet(this, _ModelRule_enabled, () => Boolean(enabled), "f");
        }
        else {
            __classPrivateFieldSet(this, _ModelRule_enabled, enabled, "f");
        }
        __classPrivateFieldSet(this, _ModelRule_triggers, triggersModel.merge(triggers), "f");
        if (!isNil(validator) && !isFunction(validator)) {
            throw new Error('Validator must me a function');
        }
    }
    getRequires() {
        return __classPrivateFieldGet(this, _ModelRule_requires, "f");
    }
    getAttribute(requiredValues) {
        if (isNil(__classPrivateFieldGet(this, _ModelRule_attribute, "f"))) {
            return undefined;
        }
        return __classPrivateFieldGet(this, _ModelRule_attribute, "f").call(this, requiredValues);
    }
    getEnabled(requiredValues, attribute) {
        return __classPrivateFieldGet(this, _ModelRule_enabled, "f").call(this, requiredValues, attribute) === true;
    }
    hasAttribute() {
        return !isNil(__classPrivateFieldGet(this, _ModelRule_attribute, "f"));
    }
    runValidator(property, attribute) {
        if (!isNil(__classPrivateFieldGet(this, _ModelRule_validator, "f"))) {
            return __classPrivateFieldGet(this, _ModelRule_validator, "f").call(this, property, attribute);
        }
        return null;
    }
    getTriggers() {
        return __classPrivateFieldGet(this, _ModelRule_triggers, "f");
    }
}
_ModelRule_requires = new WeakMap(), _ModelRule_attribute = new WeakMap(), _ModelRule_enabled = new WeakMap(), _ModelRule_validator = new WeakMap(), _ModelRule_triggers = new WeakMap();

export { ModelRule as default };
