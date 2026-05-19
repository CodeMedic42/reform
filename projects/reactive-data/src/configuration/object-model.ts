import { mapValues, forEach, reduce } from 'lodash-es';
import { buildModel, registerModel } from './model-registry';
import BaseModel, { BuildOptions } from './base-model';
import { ModelDefinition } from './configuration-types';
import ObjectValue from '../data/object-value';
import PropertyAccess from '../data/property-access';
import TriggersModel from './triggers-model';

class ObjectModel extends BaseModel {
	#keys: {
		[key: string]: BaseModel;
	};

	constructor(modelDef: ModelDefinition, triggersModel: TriggersModel) {
		super(modelDef, triggersModel);

		this.#keys = mapValues(modelDef.keys, (childModel) => buildModel(childModel, this.getTriggers()));
	}

	getKey(key: string) {
		return this.#keys[key];
	}

	forEach(cb: (model: BaseModel, key: string) => boolean | undefined | void) {
		forEach(this.#keys, cb);
	}

	mapValues(cb: (model: BaseModel, key: string) => boolean | undefined | void) {
		return mapValues(this.#keys, cb);
	}

	reduce(acc: unknown, cb: (acc: unknown, model: BaseModel, key: string) => unknown) {
		return reduce(this.#keys, cb, acc);
	}

	build(options: BuildOptions): PropertyAccess {
		const {
			initial,
			dataControl,
			path,
		} = options;

		const propertyValue: ObjectValue = new ObjectValue({
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
registerModel('object', ObjectModel);

export default ObjectModel;