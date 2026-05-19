import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { toPath } from 'lodash-es';

var _Property_propertyAccess;
// Internally called PropertyInterface
class Property {
    constructor(propertyAccess) {
        _Property_propertyAccess.set(this, void 0);
        __classPrivateFieldSet(this, _Property_propertyAccess, propertyAccess, "f");
    }
    getUuid() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getUuid();
    }
    getModel() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getModel();
    }
    getData() {
        const dataControl = __classPrivateFieldGet(this, _Property_propertyAccess, "f").getDataControl();
        return dataControl.getInterface();
    }
    getPath() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getPath();
    }
    getValue() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getValue();
    }
    setValue(newValue) {
        const changed = __classPrivateFieldGet(this, _Property_propertyAccess, "f").setValue(newValue, true);
        return changed;
    }
    insertValue(value, keydex) {
        const changed = __classPrivateFieldGet(this, _Property_propertyAccess, "f").insertValue(value, keydex, true);
        return changed;
    }
    removeValue(keydex) {
        const changed = __classPrivateFieldGet(this, _Property_propertyAccess, "f").removeValue(keydex, true);
        return changed;
    }
    moveValue(fromKeydex, toKeydex) {
        const changed = __classPrivateFieldGet(this, _Property_propertyAccess, "f").moveValue(fromKeydex, toKeydex, true);
        return changed;
    }
    getPropertyAt(path) {
        const segments = toPath(path);
        const propertyAccess = __classPrivateFieldGet(this, _Property_propertyAccess, "f").getPropertyAccessAt(segments);
        return propertyAccess.getInterface();
    }
    getLength() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getLength();
    }
    forEach(cb) {
        __classPrivateFieldGet(this, _Property_propertyAccess, "f").forEach((propertyAccess, keyDex) => cb(propertyAccess.getInterface(), keyDex));
    }
    map(cb) {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").map((propertyAccess, keyDex) => cb(propertyAccess.getInterface(), keyDex));
    }
    isEqual(comparator) {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").isEqual(comparator);
    }
    onChange(cb) {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").onChange(cb);
    }
    onStateChange(listener) {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").onStateChange(listener);
    }
    getState() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getState();
    }
    getRulesStatus() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").getRulesStatus();
    }
    isValid() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").isValid();
    }
    dispose() {
        __classPrivateFieldGet(this, _Property_propertyAccess, "f").dispose();
    }
    validate() {
        return __classPrivateFieldGet(this, _Property_propertyAccess, "f").validate();
    }
}
_Property_propertyAccess = new WeakMap();

export { Property as default };
