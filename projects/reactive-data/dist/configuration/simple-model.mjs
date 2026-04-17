import BaseModel from './base-model.mjs';
import PropertyAccess from '../data/property-access.mjs';
import SimpleValue from '../data/simple-value.mjs';
import { registerModel } from './model-registry.mjs';

class SimpleModel extends BaseModel {
    constructor(modelDef, triggersModel) {
        super(modelDef, triggersModel);
    }
    build(options) {
        const { initial, dataControl, path, } = options;
        const propertyValue = new SimpleValue({
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
// Register this model type
registerModel('simple', SimpleModel);

export { SimpleModel as default };
