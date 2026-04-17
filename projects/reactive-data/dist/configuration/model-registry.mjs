import { __classPrivateFieldGet, __classPrivateFieldSet } from 'tslib';
import { isNil } from 'lodash-es';

var _a, _ModelRegistry_instance, _ModelRegistry_modelTypes;
class ModelRegistry {
    constructor() {
        _ModelRegistry_modelTypes.set(this, new Map());
    }
    static getInstance() {
        if (isNil(__classPrivateFieldGet(_a, _a, "f", _ModelRegistry_instance))) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _ModelRegistry_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _ModelRegistry_instance);
    }
    registerModel(type, constructor) {
        __classPrivateFieldGet(this, _ModelRegistry_modelTypes, "f").set(type, constructor);
    }
    createModel(modelDef, triggersModel) {
        if (isNil(modelDef)) {
            throw new Error('No model definition detected.');
        }
        const ModelConstructor = __classPrivateFieldGet(this, _ModelRegistry_modelTypes, "f").get(modelDef.type);
        if (!ModelConstructor) {
            throw new Error(`Unknown model type: ${modelDef.type}`);
        }
        return new ModelConstructor(modelDef, triggersModel);
    }
}
_a = ModelRegistry, _ModelRegistry_modelTypes = new WeakMap();
_ModelRegistry_instance = { value: void 0 };
function buildModel(modelDef, triggersModel) {
    return ModelRegistry.getInstance().createModel(modelDef, triggersModel);
}
function registerModel(type, constructor) {
    ModelRegistry.getInstance().registerModel(type, constructor);
}

export { buildModel, registerModel };
