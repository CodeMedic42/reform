import { mapValues } from 'lodash-es';
import ModelRule from './model-rule';
import { RulesDefinition } from './configuration-types';
import TriggersModel from './triggers-model';

class ModelRules {
	#rules: {
		[key: string]: ModelRule;
	};

	constructor(modelRules: RulesDefinition | undefined, triggersModel: TriggersModel) {
		this.#rules = mapValues(modelRules, (modelRule) => new ModelRule(modelRule, triggersModel));
	}

	getRules() {
		return this.#rules;
	}
}

export default ModelRules;