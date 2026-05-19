import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { mapValues, isNil, keys, forEach, map, noop, join } from 'lodash-es';
import { nanoid } from 'nanoid';
import Property from './property.mjs';
import PropertyRule from './property-rule.mjs';
import { State, getHighestState } from './state-constant.mjs';

var _PropertyAccess_instances, _PropertyAccess_value, _PropertyAccess_lastListenerId, _PropertyAccess_onChangeListeners, _PropertyAccess_onStateChangeListeners, _PropertyAccess_rules, _PropertyAccess_interface, _PropertyAccess_ruleStates, _PropertyAccess_invalidRules, _PropertyAccess_state, _PropertyAccess_lastUsedListenerId, _PropertyAccess_uuid, _PropertyAccess_triggerChange;
class PropertyAccess {
    constructor(options) {
        _PropertyAccess_instances.add(this);
        _PropertyAccess_value.set(this, void 0);
        _PropertyAccess_lastListenerId.set(this, 0);
        _PropertyAccess_onChangeListeners.set(this, {});
        _PropertyAccess_onStateChangeListeners.set(this, {});
        _PropertyAccess_rules.set(this, void 0);
        _PropertyAccess_interface.set(this, void 0);
        _PropertyAccess_ruleStates.set(this, {});
        _PropertyAccess_invalidRules.set(this, {});
        _PropertyAccess_state.set(this, State.idle);
        _PropertyAccess_lastUsedListenerId.set(this, 0);
        _PropertyAccess_uuid.set(this, void 0);
        const { value, } = options;
        __classPrivateFieldSet(this, _PropertyAccess_uuid, nanoid(), "f");
        __classPrivateFieldSet(this, _PropertyAccess_value, value, "f");
        __classPrivateFieldSet(this, _PropertyAccess_interface, new Property(this), "f");
        __classPrivateFieldSet(this, _PropertyAccess_rules, mapValues(value.getModel().getRules().getRules(), (rule) => {
            const propertyRule = new PropertyRule(rule, this);
            propertyRule.onStateChange((changedRule, previousRuleState) => {
                const newState = changedRule.getState();
                // Update overall validity
                if (newState === State.idle) {
                    if (changedRule.isValid()) {
                        delete __classPrivateFieldGet(this, _PropertyAccess_invalidRules, "f")[changedRule.getUuid()];
                    }
                    else {
                        __classPrivateFieldGet(this, _PropertyAccess_invalidRules, "f")[changedRule.getUuid()] = changedRule;
                    }
                }
                if (!isNil(__classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[previousRuleState])) {
                    delete __classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[previousRuleState][changedRule.getUuid()];
                    if (keys(__classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[previousRuleState]).length <= 0) {
                        delete __classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[previousRuleState];
                    }
                }
                if (isNil(__classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[newState])) {
                    __classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[newState] = {};
                }
                __classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")[newState][changedRule.getUuid()] = true;
                // get highest overall state of all rules
                const highest = getHighestState(keys(__classPrivateFieldGet(this, _PropertyAccess_ruleStates, "f")));
                // The state for the property has changed if this is true.
                if (__classPrivateFieldGet(this, _PropertyAccess_state, "f") !== highest) {
                    const previousState = __classPrivateFieldGet(this, _PropertyAccess_state, "f");
                    __classPrivateFieldSet(this, _PropertyAccess_state, highest, "f");
                    forEach(__classPrivateFieldGet(this, _PropertyAccess_onStateChangeListeners, "f"), (listener) => {
                        listener(this, previousState);
                    });
                    this.getDataControl().stateChangedAt(this, previousState);
                }
            });
            return propertyRule;
        }), "f");
    }
    onStateChange(listener) {
        var _a, _b;
        const id = (__classPrivateFieldSet(this, _PropertyAccess_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _PropertyAccess_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _PropertyAccess_onStateChangeListeners, "f")[id] = listener;
        return () => {
            delete __classPrivateFieldGet(this, _PropertyAccess_onStateChangeListeners, "f")[id];
        };
    }
    initialize() {
        const valueProm = __classPrivateFieldGet(this, _PropertyAccess_value, "f").initialize();
        const ruleProms = map(__classPrivateFieldGet(this, _PropertyAccess_rules, "f"), (rule) => rule.initialize());
        return Promise.all([valueProm, ...ruleProms]).then(noop);
    }
    validate() {
        const valueProm = __classPrivateFieldGet(this, _PropertyAccess_value, "f").validate();
        const ruleProms = map(__classPrivateFieldGet(this, _PropertyAccess_rules, "f"), (rule) => rule.validate());
        return Promise.all([valueProm, ...ruleProms]).then(noop);
    }
    getUuid() {
        return __classPrivateFieldGet(this, _PropertyAccess_uuid, "f");
    }
    onChange(cb) {
        var _a, _b;
        const id = (__classPrivateFieldSet(this, _PropertyAccess_lastListenerId, (_b = __classPrivateFieldGet(this, _PropertyAccess_lastListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _PropertyAccess_onChangeListeners, "f")[id] = cb;
        return () => {
            delete __classPrivateFieldGet(this, _PropertyAccess_onChangeListeners, "f")[id];
        };
    }
    getInterface() {
        return __classPrivateFieldGet(this, _PropertyAccess_interface, "f");
    }
    getModel() {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").getModel();
    }
    getDataControl() {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").getDataControl();
    }
    getPath() {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").getPath();
    }
    getValue() {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").getValue();
    }
    setValue(newValue, rootChange) {
        const changed = __classPrivateFieldGet(this, _PropertyAccess_value, "f").setValue(newValue, false);
        if (changed) {
            __classPrivateFieldGet(this, _PropertyAccess_instances, "m", _PropertyAccess_triggerChange).call(this, rootChange);
        }
        return changed;
    }
    insertValue(value, keydex, rootChange) {
        const changed = __classPrivateFieldGet(this, _PropertyAccess_value, "f").insertValue(value, keydex, rootChange);
        if (changed) {
            __classPrivateFieldGet(this, _PropertyAccess_instances, "m", _PropertyAccess_triggerChange).call(this, rootChange);
        }
        return changed;
    }
    removeValue(keydex, rootChange) {
        const changed = __classPrivateFieldGet(this, _PropertyAccess_value, "f").removeValue(keydex, rootChange);
        if (changed) {
            __classPrivateFieldGet(this, _PropertyAccess_instances, "m", _PropertyAccess_triggerChange).call(this, rootChange);
        }
        return changed;
    }
    moveValue(fromKeydex, toKeydex, rootChange) {
        const changed = __classPrivateFieldGet(this, _PropertyAccess_value, "f").moveValue(fromKeydex, toKeydex, false);
        if (changed) {
            __classPrivateFieldGet(this, _PropertyAccess_instances, "m", _PropertyAccess_triggerChange).call(this, rootChange);
        }
        return changed;
    }
    getPropertyAccessAt(path) {
        if (path.length <= 0) {
            return this;
        }
        const propertyAccess = __classPrivateFieldGet(this, _PropertyAccess_value, "f").getPropertyAccessAt(path);
        if (isNil(propertyAccess)) {
            throw new Error(`Path "${join(path, '.')}" does not exist.`);
        }
        return propertyAccess;
    }
    getLength() {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").getLength();
    }
    forEach(cb) {
        __classPrivateFieldGet(this, _PropertyAccess_value, "f").forEach(cb);
    }
    map(cb) {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").map(cb);
    }
    isEqual(comparator) {
        return __classPrivateFieldGet(this, _PropertyAccess_value, "f").isEqual(comparator);
    }
    getRulesStatus() {
        return mapValues(__classPrivateFieldGet(this, _PropertyAccess_rules, "f"), (rule) => rule.getStatus());
    }
    getState() {
        return __classPrivateFieldGet(this, _PropertyAccess_state, "f");
    }
    isValid() {
        return keys(__classPrivateFieldGet(this, _PropertyAccess_invalidRules, "f")).length <= 0;
    }
    dispose() {
        __classPrivateFieldGet(this, _PropertyAccess_value, "f").dispose();
    }
}
_PropertyAccess_value = new WeakMap(), _PropertyAccess_lastListenerId = new WeakMap(), _PropertyAccess_onChangeListeners = new WeakMap(), _PropertyAccess_onStateChangeListeners = new WeakMap(), _PropertyAccess_rules = new WeakMap(), _PropertyAccess_interface = new WeakMap(), _PropertyAccess_ruleStates = new WeakMap(), _PropertyAccess_invalidRules = new WeakMap(), _PropertyAccess_state = new WeakMap(), _PropertyAccess_lastUsedListenerId = new WeakMap(), _PropertyAccess_uuid = new WeakMap(), _PropertyAccess_instances = new WeakSet(), _PropertyAccess_triggerChange = function _PropertyAccess_triggerChange(rootChange) {
    forEach(__classPrivateFieldGet(this, _PropertyAccess_onChangeListeners, "f"), (cb) => {
        cb(this);
    });
    __classPrivateFieldGet(this, _PropertyAccess_value, "f").getDataControl().changedAt(this);
    if (rootChange) {
        __classPrivateFieldGet(this, _PropertyAccess_value, "f").getDataControl().changed(this);
    }
};

export { PropertyAccess as default };
