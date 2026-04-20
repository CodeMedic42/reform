import { isNil } from 'lodash-es';
import { ModelDefinition } from './configuration-types';
import BaseModel from './base-model';
import TriggersModel from './triggers-model';

type ModelConstructor = new (modelDef: ModelDefinition, triggersModel: TriggersModel) => BaseModel;

class ModelRegistry {
	static #instance: ModelRegistry;

	#modelTypes = new Map<string, ModelConstructor>();

	static getInstance(): ModelRegistry {
		if (isNil(ModelRegistry.#instance)) {
			ModelRegistry.#instance = new ModelRegistry();
		}

		return ModelRegistry.#instance;
	}

	registerModel(type: string, constructor: ModelConstructor): void {
		this.#modelTypes.set(type, constructor);
	}

	createModel(modelDef: ModelDefinition, triggersModel: TriggersModel): BaseModel {
		if (isNil(modelDef)) {
			throw new Error('No model definition detected.');
		}

		const ModelConstructor = this.#modelTypes.get(modelDef.type);
		if (!ModelConstructor) {
			throw new Error(`Unknown model type: ${modelDef.type}`);
		}

		return new ModelConstructor(modelDef, triggersModel);
	}
}

export function buildModel(modelDef: ModelDefinition, triggersModel: TriggersModel): BaseModel {
	return ModelRegistry.getInstance().createModel(modelDef, triggersModel);
}

export function registerModel(type: string, constructor: ModelConstructor): void {
	ModelRegistry.getInstance().registerModel(type, constructor);
}
