import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { mapValues, forEach, reduce } from 'lodash-es';
import { registerModel, buildModel } from './model-registry.mjs';
import BaseModel from './base-model.mjs';
import ObjectValue from '../data/object-value.mjs';
import PropertyAccess from '../data/property-access.mjs';

var _ObjectModel_keys;
class ObjectModel extends BaseModel {
    constructor(modelDef, triggersModel) {
        super(modelDef, triggersModel);
        _ObjectModel_keys.set(this, void 0);
        __classPrivateFieldSet(this, _ObjectModel_keys, mapValues(modelDef.keys, (childModel) => {
            return buildModel(childModel, this.getTriggers());
        }), "f");
    }
    getKey(key) {
        return __classPrivateFieldGet(this, _ObjectModel_keys, "f")[key];
    }
    forEach(cb) {
        forEach(__classPrivateFieldGet(this, _ObjectModel_keys, "f"), cb);
    }
    mapValues(cb) {
        return mapValues(__classPrivateFieldGet(this, _ObjectModel_keys, "f"), cb);
    }
    reduce(acc, cb) {
        return reduce(__classPrivateFieldGet(this, _ObjectModel_keys, "f"), cb, acc);
    }
    build(options) {
        const { initial, dataControl, path, } = options;
        const propertyValue = new ObjectValue({
            initial,
            model: this,
            path,
            dataControl,
        });
        return new PropertyAccess({
            value: propertyValue
        });
    }
}
_ObjectModel_keys = new WeakMap();
// Register this model type
registerModel('object', ObjectModel);

export { ObjectModel as default };
