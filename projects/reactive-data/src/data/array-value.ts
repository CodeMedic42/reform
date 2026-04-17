import { isNil, forEach, toNumber, map, isArray, noop, isString, isSafeInteger } from "lodash-es";
import PropertyAccess from './property-access';
import ArrayModel from "../configuration/array-model";
import PropertyModelValue, { PropertyModelValueOptions } from "./property-model-value";

type ArrayValueOptions = PropertyModelValueOptions<ArrayModel> & {
	initial: any[];
};

function convertToInteger(value: string | number) {
	let integer = value;

	if (isString(integer)) {
		integer = toNumber(integer);
	}

	if (!isSafeInteger(integer)) {
		throw new Error('Keydex must be a number for arrays');
	}

	return integer;
}

export default class ArrayValue extends PropertyModelValue<ArrayModel> {
	#value: PropertyAccess[] = [];

	constructor(options: ArrayValueOptions) {
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

		forEach(initial, (childValue: any, childIndex: number) => {
			const childOptions = {
				initial: childValue,
				path: path.concat(`${childIndex}`),
				dataControl,
			};

			this.#value[childIndex] = model.getItems().build(childOptions);
		});
	}

	getPropertyAccessAt(segments: string[]): PropertyAccess {
		if (segments.length <= 0) {
			throw new Error('Path segments cannot be empty');
		}

		const childIndex = toNumber(segments.shift());

		if (isNil(childIndex)) {
			throw new Error('Path segments cannot be undefined');
		}

		return this.#value[childIndex].getPropertyAccessAt(segments);
	}

	setValue(newValue: any[], rootChange: boolean): boolean {
		let changed = false;

		let counter = 0;

		for(counter; counter < newValue.length; counter++) {
			const childValue = newValue[counter];
			let childProperty = this.#value[counter];

			if (!isNil(childProperty)) {
				changed = childProperty.setValue(childValue, rootChange) || changed;
			} else {
				changed = true;

				const childOptions = {
					initial: childValue,
					path: this.getPath().concat(`${counter}`),
					dataControl: this.getDataControl(),
				};
	
				this.#value[counter] = this.getModel().getItems().build(childOptions);
			}
		}

		if (counter < this.#value.length) {
			const removed = this.#value.splice(counter, this.#value.length - counter);

			forEach(removed, (removed: PropertyAccess) => {
				removed.setValue(undefined, rootChange);

				removed.dispose();
			});
		}

		return changed;
	}

	insertValue(value: any, keydex: any) {
		const childOptions = {
			initial: value,
			path: this.getPath().concat(`${keydex}`),
			dataControl: this.getDataControl(),
		};

		const propertyAccess = this.getModel().getItems().build(childOptions);

		if (this.#value.length <= keydex) {
			this.#value[keydex] = propertyAccess;
		} else {
			this.#value.splice(keydex, 0, propertyAccess);
		}

		return true;
	}

	removeValue(keydex: any) {
		if (this.#value.length <= keydex) {
			return false;
		}

		const removedProperties = this.#value.splice(keydex, 1);

		forEach(removedProperties, (removedProperty) => {
			removedProperty.setValue(undefined, true);

			removedProperty.dispose();
		});
		
		return true;
	}

	/*
		from 3 to 5
		shift 5 down and then put 3 in 5

		from 5 to 3
		shift 3 up and then put 5 in 3
	*/
	moveValue(fromKeydex: number | string, toKeydex: number | string): boolean {
		const from = convertToInteger(fromKeydex);
		const to = convertToInteger(toKeydex);

		if (from === to) {
			return false;
		}

		let changed = false;
		let forCompare;
		let forInc;
		let getFiller;

		if (from < to) {
			forCompare = (counter: number) => counter < to;
			forInc = (counter: number) => counter+1;
			getFiller = (counter: number) => this.#value[counter+1];
		} else {
			forCompare = (counter: number) => counter > to;
			forInc = (counter: number) => counter-1;
			getFiller = (counter: number) => this.#value[counter-1];
		}

		let fromProperty = this.#value[from];
		let toProperty = this.#value[to];
		const fromValue = fromProperty.getValue();

		for(let counter = from; forCompare(counter); counter = forInc(counter)) {
			let emptyProperty = this.#value[counter];
			let fillerProperty = getFiller(counter);

			const fillerValue = fillerProperty.getValue();
			changed = emptyProperty.setValue(fillerValue, false) || changed;
		}

		changed = toProperty.setValue(fromValue, false) || changed;

		return changed;
	}

	getValue(): any {
		return map(this.#value, (childProperty) => childProperty.getValue())
	}

	map<T>(cb: (item: any, key: any) => T): T[] {
		return map(this.#value, cb);
	}

	forEach(cb: (item: any, key: any) => boolean | undefined | void) {
		forEach(this.#value, cb);
	}

	reduce(cb: () => boolean | undefined) {
		return forEach(this.#value, cb);
	}

	isEqual(comparator: any) {
		if (isNil(comparator)) {
			return this.getLength() === 0;
		}

		if (!isArray(comparator)) {
			return false;
		}

		if (this.getLength() !== comparator.length) {
			return false;
		}

		let match = true;

		this.forEach((property: PropertyAccess, index) => {
			match = property.isEqual(comparator[index]);

			return match;
		});

		return match;
	}

	getLength() {
		return this.#value.length;
	}


	dispose() {
		forEach(this.#value, (childProperty) => {
			childProperty.dispose();
		});
	}

	initialize(): Promise<void> {
		const childInitProms = this.map((item: PropertyAccess) => {
			return item.initialize();
		});

		return Promise.all(childInitProms).then(noop);
	}

	validate(): Promise<void> {
		const childInitProms = this.map((item: PropertyAccess) => {
			return item.validate();
		});

		return Promise.all(childInitProms).then(noop);
	}
}