import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { registerModel, buildModel } from './model-registry.mjs';
import BaseModel from './base-model.mjs';
import PropertyAccess from '../data/property-access.mjs';
import ArrayValue from '../data/array-value.mjs';
import { isNil } from 'lodash-es';

var _ArrayModel_items;
class ArrayModel extends BaseModel {
    constructor(modelDef, triggersModel) {
        super(modelDef, triggersModel);
        _ArrayModel_items.set(this, void 0);
        if (isNil(modelDef.items)) {
            throw new Error('An array model must have defined items');
        }
        __classPrivateFieldSet(this, _ArrayModel_items, buildModel(modelDef.items, this.getTriggers()), "f");
    }
    getItems() {
        return __classPrivateFieldGet(this, _ArrayModel_items, "f");
    }
    build(options) {
        const { initial, dataControl, path, } = options;
        const propertyValue = new ArrayValue({
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
_ArrayModel_items = new WeakMap();
// Register this model type
registerModel('array', ArrayModel);

export { ArrayModel as default };
