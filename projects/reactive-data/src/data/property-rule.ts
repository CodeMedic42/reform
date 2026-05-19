import { map, forEach, isEqual, isNil } from "lodash-es";
import { nanoid } from 'nanoid';
import ModelRule from "../configuration/model-rule";
import PropertyAccess from "./property-access";
import Property from "./property";
import { State } from './state-constant';

type Listeners = { [key: number]: Function };

export interface RuleStatus {
	attribute: any,
	enabled: boolean,
	message: string | null,
}

class PropertyRule {
	#initialized: boolean = false;

	#rule: ModelRule;

	#propertyAccess: PropertyAccess;

	#attribute?: any;

	#enabled: boolean;

	#required: (Property | undefined)[];

	#newRequiredValues: boolean;

	#validationStale: boolean;

	#listeners: Function[];

	#message: string | null = null;

	#uuid: string;

	#onStateChangeListeners: Listeners = {};

	#lastUsedListenerId = 0;

	#state: State = State.idle;

	constructor(
		rule: ModelRule,
		propertyAccess: PropertyAccess,
	) {
		this.#rule = rule;
		this.#propertyAccess = propertyAccess;
		this.#attribute = undefined;
		this.#enabled = false;
		this.#required = [];
		this.#newRequiredValues = false;
		this.#validationStale = true;
		this.#uuid = nanoid();

		// Listen for changes for the required values.
		this.#listeners = map(rule.getRequires(), (requirePath, index) => propertyAccess.getDataControl().onChangedAt(requirePath, (requiredPropertyAccess: PropertyAccess) => {
				this.#required[index] = requiredPropertyAccess.getInterface();

				this.#newRequiredValues = true;
			}));

		// Listen for when a round of changes has ended.
		propertyAccess.getDataControl().onChange( async () => {
			// Reevaluate the attribute status
			if (this.#newRequiredValues) {
				this.#newRequiredValues = false;
				this.#validationStale = true;

				if (this.#rule.hasAttribute()) {
					this.#stateChange(State.updating);
					// propertyAccess.setRuleState(this, State.updating);

					const attribute = await this.#rule.getAttribute(this.#required);

					if (!isEqual(attribute, this.#attribute)) {
						this.#attribute = attribute;
					}
				}

				this.#enabled = this.#rule.getEnabled(this.#required, this.#attribute);
			}

			const triggers = this.#rule.getTriggers();

			if (triggers.triggerOnChange()) {
				await this.#performValidation();
			}

			this.#stateChange(State.idle);
		});

		// Listen for change on when the property changes.
		propertyAccess.onChange(async () => {
			this.#validationStale = true;
		});
	}

	async validate() {
		return this.#performValidation();
	}

	async initialize() {
		if (this.#initialized) {
			throw new Error('Rule has already been initialized');
		}

		this.#initialized = true;
		this.#required = [];

		forEach(this.#rule.getRequires(), (requirePath, index) => {
			const propertyAccess = this.#propertyAccess.getDataControl().getPropertyAccessAt(requirePath);
	
			this.#required[index] =
				!isNil(propertyAccess)
					? propertyAccess.getInterface()
					: undefined;
		});

		if (this.#rule.hasAttribute()) {
			this.#attribute = await this.#rule.getAttribute(this.#required);
		}
		
		this.#enabled = this.#rule.getEnabled(this.#required, this.#attribute);

		const triggers = this.#rule.getTriggers();
		
		if (triggers.triggerOnInitialize()) {
			await this.#performValidation();
		}
	}

	async #performValidation() {
		if (!this.#validationStale || !this.#enabled) {
			return;
		}

		this.#stateChange(State.validating);
	
		this.#message = await this.#rule.runValidator(this.#propertyAccess.getInterface(), this.#attribute);
	
		this.#validationStale = false;

		this.#stateChange(State.idle);
	}

	getUuid() {
		return this.#uuid;
	}

	getStatus(): RuleStatus {
		return {
			attribute: this.#attribute,
			enabled: this.#enabled,
			message: this.#message,
		};
	}

	getState() {
		return this.#state;
	}

	onStateChange(listener: Function) {
		const id = this.#lastUsedListenerId++;

		this.#onStateChangeListeners[id] = listener;

		return () => {
			delete this.#onStateChangeListeners[id];
		};
	}

	#stateChange(state: State) {
		if (this.#state === state) {
			return;
		}

		const previousState = this.#state;
		this.#state = state;

		forEach(this.#onStateChangeListeners, (listener) => {
			listener(this, previousState);
		});
	}

	isValid() {
		return isNil(this.#message);
	}
}

export default PropertyRule;