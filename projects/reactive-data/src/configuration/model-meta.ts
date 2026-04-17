import { cloneDeep } from "lodash-es";

export default class ModelMeta {
	#meta: { [key: string]: any } = {};

	constructor(meta: { [key: string]: any} = {}) {
		this.#meta = cloneDeep(meta);
	}

	get(id:string) {
		return this.#meta[id];
	}
}