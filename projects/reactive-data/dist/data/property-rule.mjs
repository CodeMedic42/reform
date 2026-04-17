import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { map, isEqual, forEach, isNil } from 'lodash-es';
import { nanoid } from 'nanoid';
import { State } from './state-constant.mjs';

var _PropertyRule_instances, _PropertyRule_initialized, _PropertyRule_rule, _PropertyRule_propertyAccess, _PropertyRule_attribute, _PropertyRule_enabled, _PropertyRule_required, _PropertyRule_newRequiredValues, _PropertyRule_validationStale, _PropertyRule_listeners, _PropertyRule_message, _PropertyRule_uuid, _PropertyRule_onStateChangeListeners, _PropertyRule_lastUsedListenerId, _PropertyRule_state, _PropertyRule_performValidation, _PropertyRule_stateChange;
class PropertyRule {
    constructor(rule, propertyAccess) {
        _PropertyRule_instances.add(this);
        _PropertyRule_initialized.set(this, false);
        _PropertyRule_rule.set(this, void 0);
        _PropertyRule_propertyAccess.set(this, void 0);
        _PropertyRule_attribute.set(this, void 0);
        _PropertyRule_enabled.set(this, void 0);
        _PropertyRule_required.set(this, void 0);
        _PropertyRule_newRequiredValues.set(this, void 0);
        _PropertyRule_validationStale.set(this, void 0);
        _PropertyRule_listeners.set(this, void 0);
        _PropertyRule_message.set(this, null);
        _PropertyRule_uuid.set(this, void 0);
        _PropertyRule_onStateChangeListeners.set(this, {});
        _PropertyRule_lastUsedListenerId.set(this, 0);
        _PropertyRule_state.set(this, State.idle);
        __classPrivateFieldSet(this, _PropertyRule_rule, rule, "f");
        __classPrivateFieldSet(this, _PropertyRule_propertyAccess, propertyAccess, "f");
        __classPrivateFieldSet(this, _PropertyRule_attribute, undefined, "f");
        __classPrivateFieldSet(this, _PropertyRule_enabled, false, "f");
        __classPrivateFieldSet(this, _PropertyRule_required, [], "f");
        __classPrivateFieldSet(this, _PropertyRule_newRequiredValues, false, "f");
        __classPrivateFieldSet(this, _PropertyRule_validationStale, true, "f");
        __classPrivateFieldSet(this, _PropertyRule_uuid, nanoid(), "f");
        // Listen for changes for the required values.
        __classPrivateFieldSet(this, _PropertyRule_listeners, map(rule.getRequires(), (requirePath, index) => {
            return propertyAccess.getDataControl().onChangedAt(requirePath, (requiredPropertyAccess) => {
                __classPrivateFieldGet(this, _PropertyRule_required, "f")[index] = requiredPropertyAccess.getInterface();
                __classPrivateFieldSet(this, _PropertyRule_newRequiredValues, true, "f");
            });
        }), "f");
        // Listen for when a round of changes has ended.
        propertyAccess.getDataControl().onChange(async () => {
            // Reevaluate the attribute status
            if (__classPrivateFieldGet(this, _PropertyRule_newRequiredValues, "f")) {
                __classPrivateFieldSet(this, _PropertyRule_newRequiredValues, false, "f");
                __classPrivateFieldSet(this, _PropertyRule_validationStale, true, "f");
                if (__classPrivateFieldGet(this, _PropertyRule_rule, "f").hasAttribute()) {
                    __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_stateChange).call(this, State.updating);
                    // propertyAccess.setRuleState(this, State.updating);
                    const attribute = await __classPrivateFieldGet(this, _PropertyRule_rule, "f").getAttribute(__classPrivateFieldGet(this, _PropertyRule_required, "f"));
                    if (!isEqual(attribute, __classPrivateFieldGet(this, _PropertyRule_attribute, "f"))) {
                        __classPrivateFieldSet(this, _PropertyRule_attribute, attribute, "f");
                    }
                }
                __classPrivateFieldSet(this, _PropertyRule_enabled, __classPrivateFieldGet(this, _PropertyRule_rule, "f").getEnabled(__classPrivateFieldGet(this, _PropertyRule_required, "f"), __classPrivateFieldGet(this, _PropertyRule_attribute, "f")), "f");
            }
            const triggers = __classPrivateFieldGet(this, _PropertyRule_rule, "f").getTriggers();
            if (triggers.triggerOnChange()) {
                await __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_performValidation).call(this);
            }
            __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_stateChange).call(this, State.idle);
        });
        // Listen for change on when the property changes.
        propertyAccess.onChange(async () => {
            __classPrivateFieldSet(this, _PropertyRule_validationStale, true, "f");
        });
    }
    async validate() {
        return await __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_performValidation).call(this);
    }
    async initialize() {
        if (__classPrivateFieldGet(this, _PropertyRule_initialized, "f")) {
            throw new Error('Rule has already been initialized');
        }
        __classPrivateFieldSet(this, _PropertyRule_initialized, true, "f");
        __classPrivateFieldSet(this, _PropertyRule_required, [], "f");
        forEach(__classPrivateFieldGet(this, _PropertyRule_rule, "f").getRequires(), (requirePath, index) => {
            const propertyAccess = __classPrivateFieldGet(this, _PropertyRule_propertyAccess, "f").getDataControl().getPropertyAccessAt(requirePath);
            __classPrivateFieldGet(this, _PropertyRule_required, "f")[index] =
                !isNil(propertyAccess)
                    ? propertyAccess.getInterface()
                    : undefined;
        });
        if (__classPrivateFieldGet(this, _PropertyRule_rule, "f").hasAttribute()) {
            __classPrivateFieldSet(this, _PropertyRule_attribute, await __classPrivateFieldGet(this, _PropertyRule_rule, "f").getAttribute(__classPrivateFieldGet(this, _PropertyRule_required, "f")), "f");
        }
        __classPrivateFieldSet(this, _PropertyRule_enabled, __classPrivateFieldGet(this, _PropertyRule_rule, "f").getEnabled(__classPrivateFieldGet(this, _PropertyRule_required, "f"), __classPrivateFieldGet(this, _PropertyRule_attribute, "f")), "f");
        const triggers = __classPrivateFieldGet(this, _PropertyRule_rule, "f").getTriggers();
        if (triggers.triggerOnInitialize()) {
            await __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_performValidation).call(this);
        }
    }
    getUuid() {
        return __classPrivateFieldGet(this, _PropertyRule_uuid, "f");
    }
    getStatus() {
        return {
            attribute: __classPrivateFieldGet(this, _PropertyRule_attribute, "f"),
            enabled: __classPrivateFieldGet(this, _PropertyRule_enabled, "f"),
            message: __classPrivateFieldGet(this, _PropertyRule_message, "f"),
        };
    }
    getState() {
        return __classPrivateFieldGet(this, _PropertyRule_state, "f");
    }
    onStateChange(listener) {
        var _a, _b;
        const id = (__classPrivateFieldSet(this, _PropertyRule_lastUsedListenerId, (_b = __classPrivateFieldGet(this, _PropertyRule_lastUsedListenerId, "f"), _a = _b++, _b), "f"), _a);
        __classPrivateFieldGet(this, _PropertyRule_onStateChangeListeners, "f")[id] = listener;
        return () => {
            delete __classPrivateFieldGet(this, _PropertyRule_onStateChangeListeners, "f")[id];
        };
    }
    isValid() {
        return isNil(__classPrivateFieldGet(this, _PropertyRule_message, "f"));
    }
}
_PropertyRule_initialized = new WeakMap(), _PropertyRule_rule = new WeakMap(), _PropertyRule_propertyAccess = new WeakMap(), _PropertyRule_attribute = new WeakMap(), _PropertyRule_enabled = new WeakMap(), _PropertyRule_required = new WeakMap(), _PropertyRule_newRequiredValues = new WeakMap(), _PropertyRule_validationStale = new WeakMap(), _PropertyRule_listeners = new WeakMap(), _PropertyRule_message = new WeakMap(), _PropertyRule_uuid = new WeakMap(), _PropertyRule_onStateChangeListeners = new WeakMap(), _PropertyRule_lastUsedListenerId = new WeakMap(), _PropertyRule_state = new WeakMap(), _PropertyRule_instances = new WeakSet(), _PropertyRule_performValidation = async function _PropertyRule_performValidation() {
    if (!__classPrivateFieldGet(this, _PropertyRule_validationStale, "f") || !__classPrivateFieldGet(this, _PropertyRule_enabled, "f")) {
        return;
    }
    __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_stateChange).call(this, State.validating);
    __classPrivateFieldSet(this, _PropertyRule_message, await __classPrivateFieldGet(this, _PropertyRule_rule, "f").runValidator(__classPrivateFieldGet(this, _PropertyRule_propertyAccess, "f").getInterface(), __classPrivateFieldGet(this, _PropertyRule_attribute, "f")), "f");
    __classPrivateFieldSet(this, _PropertyRule_validationStale, false, "f");
    __classPrivateFieldGet(this, _PropertyRule_instances, "m", _PropertyRule_stateChange).call(this, State.idle);
}, _PropertyRule_stateChange = function _PropertyRule_stateChange(state) {
    if (__classPrivateFieldGet(this, _PropertyRule_state, "f") === state) {
        return;
    }
    const previousState = __classPrivateFieldGet(this, _PropertyRule_state, "f");
    __classPrivateFieldSet(this, _PropertyRule_state, state, "f");
    forEach(__classPrivateFieldGet(this, _PropertyRule_onStateChangeListeners, "f"), (listener) => {
        listener(this, previousState);
    });
};

export { PropertyRule as default };
