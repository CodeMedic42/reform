import { isFunction, toPath, map, isNil } from "lodash-es";
import { RuleDefinition } from "./configuration-types";
import Property from "../data/property";
import TriggersModel from "./triggers-model";

class ModelRule {
	#requires: string[][];
	#attribute?: Function;
	#enabled: Function;
	#validator?: (property: Property, attributeValue: any) => string | null;
	#triggers: TriggersModel;

	constructor(rule: RuleDefinition, triggersModel: TriggersModel) {
		const {
			requires,
			attribute,
			enabled,
			validator,
			triggers,
		} = rule;

		this.#requires = map(requires, (required) => toPath(required));
		this.#validator = validator;

		if (isNil(attribute)) {
			this.#attribute = undefined;	
		} else if (isFunction(attribute)) {
			this.#attribute = attribute;	
		} else {
			this.#attribute = () => attribute;
		}

		if (isNil(enabled)) {	
			this.#enabled = () => true;	
		} else if (!isFunction(enabled)) {
			this.#enabled = () => Boolean(enabled);
		} else {
			this.#enabled = enabled;
		}

		this.#triggers = triggersModel.merge(triggers);
		
		if (!isNil(validator) && !isFunction(validator)) {
			throw new Error('Validator must me a function');
		}
	}

	getRequires() {
		return this.#requires;
	}

	getAttribute(requiredValues: any[]): any {
		if (isNil(this.#attribute)) {
			return undefined;
		}

		return this.#attribute(requiredValues);
	}

	getEnabled(requiredValues: any[], attribute: any): any {
		return this.#enabled(requiredValues, attribute) === true;
	}

	hasAttribute() {
		return !isNil(this.#attribute);
	}

	runValidator(property: Property, attribute: any): string | null {
		if (!isNil(this.#validator)) {
			return this.#validator(property, attribute);
		}

		return null;
	}

	getTriggers() {
		return this.#triggers;
	}
}

export default ModelRule;