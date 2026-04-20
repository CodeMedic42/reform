import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { isNil, forEach, map } from 'lodash-es';
import PropertyModelValue from './property-model-value.mjs';

var _SimpleValue_value;
class SimpleValue extends PropertyModelValue {
    constructor(options) {
        const { initial, model, path, dataControl, } = options;
        super({
            model,
            path,
            dataControl,
        });
        _SimpleValue_value.set(this, void 0);
        __classPrivateFieldSet(this, _SimpleValue_value, initial, "f");
    }
    getPropertyAccessAt(segments) {
        if (segments.length <= 0) {
            throw new Error('Path segments cannot be empty');
        }
        return undefined;
    }
    setValue(newValue) {
        if (__classPrivateFieldGet(this, _SimpleValue_value, "f") === newValue) {
            return false;
        }
        __classPrivateFieldSet(this, _SimpleValue_value, newValue, "f");
        return true;
    }
    insertValue(value) {
        return this.setValue(value);
    }
    // @typescript-eslint/no-unused-vars
    removeValue(keydex) {
        return this.setValue(undefined);
    }
    moveValue() {
        return false;
    }
    getValue() {
        return __classPrivateFieldGet(this, _SimpleValue_value, "f");
    }
    getLength() {
        if (isNil(__classPrivateFieldGet(this, _SimpleValue_value, "f"))) {
            return undefined;
        }
        return __classPrivateFieldGet(this, _SimpleValue_value, "f").length;
    }
    forEach(cb) {
        forEach(__classPrivateFieldGet(this, _SimpleValue_value, "f"), cb);
    }
    map(cb) {
        return map(__classPrivateFieldGet(this, _SimpleValue_value, "f"), cb);
    }
    isEqual(comparator) {
        return comparator === __classPrivateFieldGet(this, _SimpleValue_value, "f");
    }
    initializeChildren() {
        return Promise.resolve();
    }
    validateChildren() {
        return Promise.resolve();
    }
    triggerChildren() {
        return Promise.resolve();
    }
    dispose() {
        __classPrivateFieldSet(this, _SimpleValue_value, undefined, "f");
    }
    initialize() {
        return Promise.resolve();
    }
    validate() {
        return Promise.resolve();
    }
}
_SimpleValue_value = new WeakMap();

export { SimpleValue as default };
