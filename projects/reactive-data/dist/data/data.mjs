import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { toPath } from 'lodash-es';
import DataControl from './data-control.mjs';

var _Data_dataControl;
class Data {
    constructor(dataControl) {
        _Data_dataControl.set(this, void 0);
        if (!(dataControl instanceof DataControl)) {
            throw new Error('Data requires an instance of DataControl');
        }
        __classPrivateFieldSet(this, _Data_dataControl, dataControl, "f");
    }
    static async build(configuration, value) {
        const control = new DataControl(configuration, value);
        await control.initialize();
        const data = new Data(control);
        await control.finalize(data);
        return data;
    }
    getPropertyAt(path) {
        const segments = toPath(path);
        const propertyAccess = __classPrivateFieldGet(this, _Data_dataControl, "f").getPropertyAccessAt(segments);
        return propertyAccess.getInterface();
    }
    onChange(cb) {
        return __classPrivateFieldGet(this, _Data_dataControl, "f").onChange((propertyAccess) => {
            cb(propertyAccess.getInterface());
        });
    }
    onChangedAt(path, cb) {
        const segments = toPath(path);
        return __classPrivateFieldGet(this, _Data_dataControl, "f").onChangedAt(segments, (propertyAccess) => {
            cb(propertyAccess.getInterface());
        });
    }
    onStateChange(listener) {
        return __classPrivateFieldGet(this, _Data_dataControl, "f").onStateChange(listener);
    }
    isValid() {
        return __classPrivateFieldGet(this, _Data_dataControl, "f").isValid();
    }
    async validate() {
        await __classPrivateFieldGet(this, _Data_dataControl, "f").validate();
    }
}
_Data_dataControl = new WeakMap();

export { Data as default };
