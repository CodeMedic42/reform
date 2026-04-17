import { __classPrivateFieldGet } from 'tslib';
import { isNil, forEach, mapValues, keys, map, isPlainObject, noop } from 'lodash-es';
import PropertyModelValue from './property-model-value.mjs';

var _ObjectValue_value;
class ObjectValue extends PropertyModelValue {
    constructor(options) {
        const { initial, model, path, dataControl, } = options;
        super({
            model,
            path,
            dataControl,
        });
        _ObjectValue_value.set(this, {});
        model.forEach((childModel, childKey) => {
            const childOptions = {
                initial: !isNil(initial) ? initial[childKey] : undefined,
                path: path.concat(childKey),
                dataControl,
            };
            __classPrivateFieldGet(this, _ObjectValue_value, "f")[childKey] = childModel.build(childOptions);
        });
    }
    getPropertyAccessAt(segments) {
        if (segments.length <= 0) {
            throw new Error('Path segments cannot be empty');
        }
        const childKey = segments.shift();
        if (isNil(childKey)) {
            throw new Error('Path segments cannot be undefined');
        }
        const childPropertyAccess = __classPrivateFieldGet(this, _ObjectValue_value, "f")[childKey];
        if (isNil(childPropertyAccess)) {
            return undefined;
        }
        return __classPrivateFieldGet(this, _ObjectValue_value, "f")[childKey].getPropertyAccessAt(segments);
    }
    setValue(newValue, rootChange) {
        let changed = false;
        forEach(__classPrivateFieldGet(this, _ObjectValue_value, "f"), (propertyAccess, childKey) => {
            changed = propertyAccess.setValue(newValue?.[childKey], rootChange) || changed;
        });
        return changed;
    }
    moveValue(fromKeydex, toKeydex) {
        const fromProperty = __classPrivateFieldGet(this, _ObjectValue_value, "f")[fromKeydex];
        const toProperty = __classPrivateFieldGet(this, _ObjectValue_value, "f")[toKeydex];
        const fromValue = fromProperty.getValue();
        const toValue = toProperty.getValue();
        let changed = fromProperty.setValue(toValue, false);
        changed = toProperty.setValue(fromValue, false) || changed;
        return changed;
    }
    insertValue(value, keydex, rootChange) {
        // If the property was defined in the model then it should be defined.
        if (isNil(__classPrivateFieldGet(this, _ObjectValue_value, "f")[keydex])) {
            // If not defined then there is nothing we can insert into.
            console.warn(`The key ${keydex} was not defined in the model and therefor cannot be inserted or defined after the fact. No changes have been made.`);
            return false;
        }
        const changed = __classPrivateFieldGet(this, _ObjectValue_value, "f")[keydex].setValue(value, false);
        return changed;
    }
    removeValue(keydex, rootChange) {
        // If the property was defined in the model then it should be defined.
        if (isNil(__classPrivateFieldGet(this, _ObjectValue_value, "f")[keydex])) {
            return false;
        }
        const changed = __classPrivateFieldGet(this, _ObjectValue_value, "f")[keydex].setValue(undefined, false);
        return changed;
    }
    getValue() {
        return mapValues(__classPrivateFieldGet(this, _ObjectValue_value, "f"), (childProperty) => childProperty.getValue());
    }
    getLength() {
        return keys(__classPrivateFieldGet(this, _ObjectValue_value, "f")).length;
    }
    forEach(cb) {
        forEach(__classPrivateFieldGet(this, _ObjectValue_value, "f"), cb);
    }
    map(cb) {
        return map(__classPrivateFieldGet(this, _ObjectValue_value, "f"), cb);
    }
    isEqual(comparator) {
        const normalizeComp = !isNil(comparator) ? comparator : {};
        if (!isPlainObject(normalizeComp)) {
            return false;
        }
        let match = true;
        this.forEach((property, key) => {
            match = property.isEqual(comparator[key]);
            return match;
        });
        return match;
    }
    dispose() {
        forEach(__classPrivateFieldGet(this, _ObjectValue_value, "f"), (childProperty) => {
            childProperty.dispose();
        });
    }
    initialize() {
        const childInitProms = this.map((item) => {
            return item.initialize();
        });
        return Promise.all(childInitProms).then(noop);
    }
    validate() {
        const childInitProms = this.map((item) => {
            return item.validate();
        });
        return Promise.all(childInitProms).then(noop);
    }
}
_ObjectValue_value = new WeakMap();

export { ObjectValue as default };
