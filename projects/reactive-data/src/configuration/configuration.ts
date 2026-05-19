import { isNil } from 'lodash-es';
import { ConfigurationDefinition } from './configuration-types';
import BaseModel from './base-model';
import { buildModel } from './model-registry';
import TriggersModel from './triggers-model';

// Import models to trigger their registration
import './object-model';
import './array-model';
import './simple-model';

class Configuration {
	#model: BaseModel;

	#triggers: TriggersModel;

	constructor(configuration: ConfigurationDefinition) {
		if (isNil(configuration)) {
			throw new Error('No configuration detected.');
		}

		this.#triggers = new TriggersModel(configuration.triggers);
		this.#model = buildModel(configuration.model, this.#triggers);
	}

	getModel() {
		return this.#model;
	}

	getTriggers() {
		return this.#triggers;
	}
}

export default Configuration;