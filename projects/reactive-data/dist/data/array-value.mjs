import { __classPrivateFieldGet } from 'tslib';
import { forEach, toNumber, isNil, map, isArray, noop, isString, isSafeInteger } from 'lodash-es';
import PropertyModelValue from './property-model-value.mjs';

var _ArrayValue_value;
function convertToInteger(value) {
    let integer = value;
    if (isString(integer)) {
        integer = toNumber(integer);
    }
    if (!isSafeInteger(integer)) {
        throw new Error('Keydex must be a number for arrays');
    }
    return integer;
}
class ArrayValue extends PropertyModelValue {
    constructor(options) {
        const { initial, model, path, dataControl, } = options;
        super({
            model,
            path,
            dataControl,
        });
        _ArrayValue_value.set(this, []);
        forEach(initial, (childValue, childIndex) => {
            const childOptions = {
                initial: childValue,
                path: path.concat(`${childIndex}`),
                dataControl,
            };
            __classPrivateFieldGet(this, _ArrayValue_value, "f")[childIndex] = model.getItems().build(childOptions);
        });
    }
    getPropertyAccessAt(segments) {
        if (segments.length <= 0) {
            throw new Error('Path segments cannot be empty');
        }
        const childIndex = toNumber(segments.shift());
        if (isNil(childIndex)) {
            throw new Error('Path segments cannot be undefined');
        }
        return __classPrivateFieldGet(this, _ArrayValue_value, "f")[childIndex].getPropertyAccessAt(segments);
    }
    setValue(newValue, rootChange) {
        let changed = false;
        let counter = 0;
        for (counter; counter < newValue.length; counter++) {
            const childValue = newValue[counter];
            const childProperty = __classPrivateFieldGet(this, _ArrayValue_value, "f")[counter];
            if (!isNil(childProperty)) {
                changed = childProperty.setValue(childValue, rootChange) || changed;
            }
            else {
                changed = true;
                const childOptions = {
                    initial: childValue,
                    path: this.getPath().concat(`${counter}`),
                    dataControl: this.getDataControl(),
                };
                __classPrivateFieldGet(this, _ArrayValue_value, "f")[counter] = this.getModel().getItems().build(childOptions);
            }
        }
        if (counter < __classPrivateFieldGet(this, _ArrayValue_value, "f").length) {
            const removed = __classPrivateFieldGet(this, _ArrayValue_value, "f").splice(counter, __classPrivateFieldGet(this, _ArrayValue_value, "f").length - counter);
            forEach(removed, (removedItem) => {
                removedItem.setValue(undefined, rootChange);
                removedItem.dispose();
            });
        }
        return changed;
    }
    insertValue(value, keydex) {
        const childOptions = {
            initial: value,
            path: this.getPath().concat(`${keydex}`),
            dataControl: this.getDataControl(),
        };
        const propertyAccess = this.getModel().getItems().build(childOptions);
        if (__classPrivateFieldGet(this, _ArrayValue_value, "f").length <= keydex) {
            __classPrivateFieldGet(this, _ArrayValue_value, "f")[keydex] = propertyAccess;
        }
        else {
            __classPrivateFieldGet(this, _ArrayValue_value, "f").splice(keydex, 0, propertyAccess);
        }
        return true;
    }
    removeValue(keydex) {
        if (__classPrivateFieldGet(this, _ArrayValue_value, "f").length <= keydex) {
            return false;
        }
        const removedProperties = __classPrivateFieldGet(this, _ArrayValue_value, "f").splice(keydex, 1);
        forEach(removedProperties, (removedProperty) => {
            removedProperty.setValue(undefined, true);
            removedProperty.dispose();
        });
        return true;
    }
    /*
        from 3 to 5
        shift 5 down and then put 3 in 5

        from 5 to 3
        shift 3 up and then put 5 in 3
    */
    moveValue(fromKeydex, toKeydex) {
        const from = convertToInteger(fromKeydex);
        const to = convertToInteger(toKeydex);
        if (from === to) {
            return false;
        }
        let changed = false;
        let forCompare;
        let forInc;
        let getFiller;
        if (from < to) {
            forCompare = (counter) => counter < to;
            forInc = (counter) => counter + 1;
            getFiller = (counter) => __classPrivateFieldGet(this, _ArrayValue_value, "f")[counter + 1];
        }
        else {
            forCompare = (counter) => counter > to;
            forInc = (counter) => counter - 1;
            getFiller = (counter) => __classPrivateFieldGet(this, _ArrayValue_value, "f")[counter - 1];
        }
        const fromProperty = __classPrivateFieldGet(this, _ArrayValue_value, "f")[from];
        const toProperty = __classPrivateFieldGet(this, _ArrayValue_value, "f")[to];
        const fromValue = fromProperty.getValue();
        for (let counter = from; forCompare(counter); counter = forInc(counter)) {
            const emptyProperty = __classPrivateFieldGet(this, _ArrayValue_value, "f")[counter];
            const fillerProperty = getFiller(counter);
            const fillerValue = fillerProperty.getValue();
            changed = emptyProperty.setValue(fillerValue, false) || changed;
        }
        changed = toProperty.setValue(fromValue, false) || changed;
        return changed;
    }
    getValue() {
        return map(__classPrivateFieldGet(this, _ArrayValue_value, "f"), (childProperty) => childProperty.getValue());
    }
    map(cb) {
        return map(__classPrivateFieldGet(this, _ArrayValue_value, "f"), cb);
    }
    forEach(cb) {
        forEach(__classPrivateFieldGet(this, _ArrayValue_value, "f"), cb);
    }
    reduce(cb) {
        return forEach(__classPrivateFieldGet(this, _ArrayValue_value, "f"), cb);
    }
    isEqual(comparator) {
        if (isNil(comparator)) {
            return this.getLength() === 0;
        }
        if (!isArray(comparator)) {
            return false;
        }
        if (this.getLength() !== comparator.length) {
            return false;
        }
        let match = true;
        this.forEach((property, index) => {
            match = property.isEqual(comparator[index]);
            return match;
        });
        return match;
    }
    getLength() {
        return __classPrivateFieldGet(this, _ArrayValue_value, "f").length;
    }
    dispose() {
        forEach(__classPrivateFieldGet(this, _ArrayValue_value, "f"), (childProperty) => {
            childProperty.dispose();
        });
    }
    initialize() {
        const childInitProms = this.map((item) => item.initialize());
        return Promise.all(childInitProms).then(noop);
    }
    validate() {
        const childInitProms = this.map((item) => item.validate());
        return Promise.all(childInitProms).then(noop);
    }
}
_ArrayValue_value = new WeakMap();

export { ArrayValue as default };
