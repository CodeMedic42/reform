import { forEach, isNil, merge } from "lodash-es";
import { TriggersDefinition } from "./configuration-types";

class TriggersModel {
	#triggers: TriggersDefinition;

	constructor(triggers: TriggersDefinition = {}) {
		this.#triggers = triggers;
	}

	triggerOnInitialize() {
		return this.#triggers.initialize === true;
	}

	triggerOnChange() {
		return this.#triggers.change === true;
	}

	merge(triggersDef: TriggersDefinition | undefined) {
		// If triggersDef is undefined then merge will just use this.#triggers.
		return new TriggersModel(merge({}, this.#triggers, triggersDef));
	}
}

export default TriggersModel;