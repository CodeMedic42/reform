import DataControl from "../data/data-control";
import PropertyAccess from "../data/property-access";
import { RulesDefinition, MetaDefinition, TriggersDefinition, ModelDefinition } from "./configuration-types";
import ModelRules from './model-rules';
import ModelMeta from "./model-meta";
import TriggersModel from "./triggers-model";

export type BuildOptions = {
	initial: any;
	dataControl: DataControl;
	path: string[];
};

abstract class BaseModel {
	#type: string;
	#meta: ModelMeta
	#rules: ModelRules;
	#triggers: TriggersModel;

	constructor(modelDef: ModelDefinition, triggersModel: TriggersModel) {
		this.#type = modelDef.type;
		this.#rules = new ModelRules(modelDef.rules, triggersModel);
		this.#meta = new ModelMeta(modelDef.meta);
		this.#triggers = triggersModel.merge(modelDef.triggers);
	}

	getType() {
		return this.#type;
	}

	getMeta() {
		return this.#meta || {};
	}

	getRules() {
		return this.#rules;
	}

	getTriggers() {
		return this.#triggers;
	}

	abstract build(options: BuildOptions): PropertyAccess
}

export default BaseModel;