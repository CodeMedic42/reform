import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import { cloneDeep } from 'lodash-es';

var _ModelMeta_meta;
class ModelMeta {
    constructor(meta = {}) {
        _ModelMeta_meta.set(this, {});
        __classPrivateFieldSet(this, _ModelMeta_meta, cloneDeep(meta), "f");
    }
    get(id) {
        return __classPrivateFieldGet(this, _ModelMeta_meta, "f")[id];
    }
}
_ModelMeta_meta = new WeakMap();

export { ModelMeta as default };
