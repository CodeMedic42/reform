import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import PropertyValue from './property-value.mjs';

var _PropertyModelValue_model, _PropertyModelValue_dataControl, _PropertyModelValue_path;
class PropertyModelValue extends PropertyValue {
    constructor(options) {
        super();
        _PropertyModelValue_model.set(this, void 0);
        _PropertyModelValue_dataControl.set(this, void 0);
        _PropertyModelValue_path.set(this, void 0);
        const { model, path, dataControl, } = options;
        __classPrivateFieldSet(this, _PropertyModelValue_model, model, "f");
        __classPrivateFieldSet(this, _PropertyModelValue_dataControl, dataControl, "f");
        __classPrivateFieldSet(this, _PropertyModelValue_path, path, "f");
    }
    getModel() {
        return __classPrivateFieldGet(this, _PropertyModelValue_model, "f");
    }
    getDataControl() {
        return __classPrivateFieldGet(this, _PropertyModelValue_dataControl, "f");
    }
    getPath() {
        return [...__classPrivateFieldGet(this, _PropertyModelValue_path, "f")];
    }
}
_PropertyModelValue_model = new WeakMap(), _PropertyModelValue_dataControl = new WeakMap(), _PropertyModelValue_path = new WeakMap();

export { PropertyModelValue as default };
