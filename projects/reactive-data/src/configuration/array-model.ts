import { isNil } from 'lodash-es';
import { buildModel, registerModel } from './model-registry';
import { ModelDefinition } from './configuration-types';
import BaseModel, { BuildOptions } from './base-model';
import PropertyAccess from '../data/property-access';
import ArrayValue from '../data/array-value';
import TriggersModel from './triggers-model';

class ArrayModel extends BaseModel {
	#items: BaseModel;

	constructor(modelDef: ModelDefinition, triggersModel: TriggersModel) {
		super(modelDef, triggersModel);

		if (isNil(modelDef.items)) {
			throw new Error('An array model must have defined items');
		}

		this.#items = buildModel(modelDef.items, this.getTriggers());
	}

	getItems() {
		return this.#items;
	}

	build(options: BuildOptions): PropertyAccess {
		const {
			initial,
			dataControl,
			path,
		} = options;

		const propertyValue: ArrayValue = new ArrayValue({
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
registerModel('array', ArrayModel);

export default ArrayModel;