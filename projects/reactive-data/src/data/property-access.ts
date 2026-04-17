import { forEach, mapValues, keys, isNil, join, map, noop } from 'lodash-es';
import { nanoid } from 'nanoid';
import PropertyValue from './property-value';
import Property from './property';
import PropertyRule, { RuleStatus } from './property-rule';
import ModelRule from '../configuration/model-rule';
import { State, getHighestState } from './state-constant';

export type PropertyOptions = {
	value: PropertyValue;
};

export interface RulesStatus {
	[key: string]: RuleStatus
}

export default class PropertyAccess {
	#value: PropertyValue;
	#lastListenerId = 0;
	#onChangeListeners: {
		[key: string]: Function 
	} = {};
	#onStateChangeListeners: { [key: string]: Function } = {};
	#rules: { [key: string]: PropertyRule; };
	#interface: Property;
	#ruleStates: {
		[key: string]: {
			[key: string]: boolean
		}
	} = {};
	#invalidRules: {
		[key: string]: PropertyRule
	} = {};
	#state = State.idle;
	#lastUsedListenerId = 0;
	#uuid: string;

	constructor(options: PropertyOptions) {
		const {
			value,
		} = options;

		this.#uuid = nanoid();

		this.#value = value;
		this.#interface = new Property(this);

		this.#lastListenerId;

		this.#rules = mapValues(value.getModel().getRules().getRules(), (rule: ModelRule) => {
			const propertyRule = new PropertyRule(rule, this);

			propertyRule.onStateChange((rule: PropertyRule, previousRuleState: State) => {
				const newState = rule.getState();

				// Update overall validity
				if (newState === State.idle) {
					if (rule.isValid()) {
						delete this.#invalidRules[rule.getUuid()];
					} else {
						this.#invalidRules[rule.getUuid()] = rule;
					}
				}

				if (!isNil(this.#ruleStates[previousRuleState])) {
					delete this.#ruleStates[previousRuleState][rule.getUuid()];

					if (keys(this.#ruleStates[previousRuleState]).length <= 0) {
						delete this.#ruleStates[previousRuleState];
					}
				}

				if (isNil(this.#ruleStates[newState])) {
					this.#ruleStates[newState] = {};
				}

				this.#ruleStates[newState][rule.getUuid()] = true;

				// get highest overall state of all rules
				const highest = getHighestState(keys(this.#ruleStates) as State[]);

				// The state for the property has changed if this is true.
				if (this.#state !== highest) {
					const previousState = this.#state;
					this.#state = highest;

					forEach(this.#onStateChangeListeners, (listener) => {
						listener(this, previousState);
					});

					this.getDataControl().stateChangedAt(this, previousState);
				}
			});

			return propertyRule;
		});
	}

	onStateChange(listener: Function) {
		const id = this.#lastUsedListenerId++;

		this.#onStateChangeListeners[id] = listener;

		return () => {
			delete this.#onStateChangeListeners[id];
		};
	}

	initialize(): Promise<void> {
		const valueProm = this.#value.initialize();

		const ruleProms = map(this.#rules, (rule) => rule.initialize());

		return Promise.all([valueProm, ...ruleProms]).then(noop);
	}

	validate(): Promise<void> {
		const valueProm = this.#value.validate();

		const ruleProms = map(this.#rules, (rule) => rule.validate());

		return Promise.all([valueProm, ...ruleProms]).then(noop);
	}

	getUuid() {
		return this.#uuid;
	}

	onChange(cb: Function) {
		const id = this.#lastListenerId++

		this.#onChangeListeners[id] = cb;

		return () => {
			delete this.#onChangeListeners[id];
		};
	}

	getInterface() {
		return this.#interface;
	}

	getModel() {
		return this.#value.getModel();
	}

	getDataControl() {
		return this.#value.getDataControl();
	}

	getPath(): string[] {
		return this.#value.getPath();
	}

	getValue() {
		return this.#value.getValue();
	}

	#triggerChange(rootChange: boolean) {
		forEach(this.#onChangeListeners, (cb) => {
			cb(this);
		})

		this.#value.getDataControl().changedAt(this);

		if (rootChange) {
			this.#value.getDataControl().changed(this);
		}
	}

	setValue(newValue: any, rootChange: boolean): boolean {
		const changed = this.#value.setValue(newValue, false);

		if (changed) {
			this.#triggerChange(rootChange);
		}

		return changed;
	}

	insertValue(value: any, keydex: any, rootChange: boolean) {
		const changed = this.#value.insertValue(value, keydex, rootChange);

		if (changed) {
			this.#triggerChange(rootChange);
		}

		return changed;
	}

	removeValue(keydex: any, rootChange: boolean) {
		const changed = this.#value.removeValue(keydex, rootChange);

		if (changed) {
			this.#triggerChange(rootChange);
		}
		
		return changed;
	}

	moveValue(fromKeydex: number | string, toKeydex: number | string, rootChange: boolean) {
		const changed = this.#value.moveValue(fromKeydex, toKeydex, false);

		if (changed) {
			this.#triggerChange(rootChange);
		}
		
		return changed;
	}

	getPropertyAccessAt(path: string[]): PropertyAccess {
		if (path.length <= 0) {
			return this;
		}

		const propertyAccess = this.#value.getPropertyAccessAt(path);

		if (isNil(propertyAccess)) {
			throw new Error(`Path "${join(path, '.')}" does not exist.`);
		}

		return propertyAccess;
	}

	getLength() {
		return this.#value.getLength();
	}

	forEach(cb: (item: any, key: any) => boolean | undefined | void) {
		this.#value.forEach(cb);
	}

	map<T>(cb: (item: any, key: any) => T): T[] {
		return this.#value.map(cb);
	}

	isEqual(comparator: any): boolean {
		return this.#value.isEqual(comparator);
	}

	getRulesStatus(): RulesStatus {
		return mapValues(this.#rules, (rule) => {
			return rule.getStatus();
		});
	}

	getState() {
		return this.#state;
	}

	isValid() {
		return keys(this.#invalidRules).length <= 0;
	}

	dispose() {
		this.#value.dispose();
	}
}