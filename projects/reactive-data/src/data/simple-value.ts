import { forEach, isNil, map } from 'lodash-es';
import SimpleModel from '../configuration/simple-model';
import PropertyAccess from './property-access';
import PropertyModelValue, { PropertyModelValueOptions } from "./property-model-value";

type SimpleValueOptions = PropertyModelValueOptions<SimpleModel> & {
	initial: any;
};

export default class SimpleValue extends PropertyModelValue<SimpleModel> {
	#value: any;

	constructor(options: SimpleValueOptions) {
		const {
			initial,
			model,
			path,
			dataControl,
		} = options;

		super({
			model,
			path,
			dataControl,
		});

		this.#value = initial;
	}

	getPropertyAccessAt(segments: string[]): PropertyAccess | undefined {
		if (segments.length <= 0) {
			throw new Error('Path segments cannot be empty');
		}

		return undefined;
	}

	setValue(newValue: any) {
		if (this.#value === newValue) {
			return false;
		}

		this.#value = newValue;

		return true;
	}
		
	insertValue(value: any) {
		return this.setValue(value);
	}
	
	// @typescript-eslint/no-unused-vars
	removeValue(keydex: any) {
		return this.setValue(undefined);
	}

	moveValue() {
		return false;
	}

	getValue(): any {
		return this.#value;
	}

	getLength() {
		if (isNil(this.#value)) {
			return undefined;
		}

		return this.#value.length;
	}

	forEach(cb: (item: any, key: any) => boolean | undefined | void) {
		forEach(this.#value, cb);
	}
		
	map<T>(cb: (item: any, key: any) => T): T[] {
		return map(this.#value, cb);
	}

	isEqual(comparator: any) {
		return comparator === this.#value;		
	}

	initializeChildren() {
		return Promise.resolve();
	}

	validateChildren() {
		return Promise.resolve();
	}

	triggerChildren() {
		return Promise.resolve();
	}
	
	dispose() {
		this.#value = undefined;
	}
		
	initialize(): Promise<void> {
		return Promise.resolve();
	}

	validate(): Promise<void> {
		return Promise.resolve();
	}
}