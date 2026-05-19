import { isNil, forEach, mapValues, keys, isPlainObject, map, noop } from "lodash-es";
import PropertyAccess from './property-access';
import BaseModel from "../configuration/base-model";
import ObjectModel from "../configuration/object-model";
import PropertyModelValue, { PropertyModelValueOptions } from "./property-model-value";

type ObjectValueOptions = PropertyModelValueOptions<ObjectModel> & {
	initial: { [key: string]: any };
};

export default class ObjectValue extends PropertyModelValue<ObjectModel> {
	#value: { [key: string]: PropertyAccess } = {};

	constructor(options: ObjectValueOptions) {
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

		model.forEach((childModel: BaseModel, childKey: string) => {
			const childOptions = {
				initial: !isNil(initial) ? initial[childKey]: undefined,
				path: path.concat(childKey),
				dataControl,
			};

			this.#value[childKey] = childModel.build(childOptions);
		});
	}

	getPropertyAccessAt(segments: string[]): PropertyAccess | undefined {
		if (segments.length <= 0) {
			throw new Error('Path segments cannot be empty');
		}

		const childKey = segments.shift();

		if (isNil(childKey)) {
			throw new Error('Path segments cannot be undefined');
		}

		const childPropertyAccess: PropertyAccess | undefined = this.#value[childKey];

		if (isNil(childPropertyAccess)) {
			return undefined;
		}

		return this.#value[childKey].getPropertyAccessAt(segments);
	}

	setValue(newValue: { [key: string]: any }, rootChange: boolean): boolean {
		let changed = false;

		forEach(this.#value, (propertyAccess: PropertyAccess, childKey: string) => {
			changed = propertyAccess.setValue(newValue?.[childKey], rootChange) || changed;
		});

		return changed;
	}

	moveValue(fromKeydex: number, toKeydex: number): boolean {
		const fromProperty = this.#value[fromKeydex];
		const toProperty = this.#value[toKeydex];

		const fromValue = fromProperty.getValue();
		const toValue = toProperty.getValue();

		let changed = fromProperty.setValue(toValue, false);
		changed = toProperty.setValue(fromValue, false) || changed;

		return changed;
	}
	
	// @typescript-eslint/no-unused-vars
	insertValue(value: any, keydex: any, rootChange: boolean) {
		// If the property was defined in the model then it should be defined.
		if (isNil(this.#value[keydex])) {
			// If not defined then there is nothing we can insert into.
			console.warn(`The key ${keydex} was not defined in the model and therefor cannot be inserted or defined after the fact. No changes have been made.`);

			return false;
		}

		const changed = this.#value[keydex].setValue(value, false);

		return changed;
	}

	// @typescript-eslint/no-unused-vars
	removeValue(keydex: any, rootChange: boolean) {
		// If the property was defined in the model then it should be defined.
		if (isNil(this.#value[keydex])) {
			return false;
		}

		const changed = this.#value[keydex].setValue(undefined, false);
		
		return changed;
	}

	getValue(): { [key: string]: any } {
		return mapValues(this.#value, (childProperty) => childProperty.getValue());
	}

	getLength() {
		return keys(this.#value).length;
	}

	forEach(cb: (item: any, key: any) => boolean | undefined | void) {
		forEach(this.#value, cb);
	}
	
	map<T>(cb: (item: any, key: any) => T): T[] {
		return map(this.#value, cb);
	}
	
	isEqual(comparator: any) {
		const normalizeComp = !isNil(comparator) ? comparator : {};

		if (!isPlainObject(normalizeComp)) {
			return false;
		}

		let match = true;

		this.forEach((property: PropertyAccess, key: string) => {
			match = property.isEqual(comparator[key]);

			return match;
		});

		return match;
	}

	dispose() {
		forEach(this.#value, (childProperty) => {
			childProperty.dispose();
		});
	}
	
	initialize(): Promise<void> {
		const childInitProms = this.map((item: PropertyAccess) => item.initialize());

		return Promise.all(childInitProms).then(noop);
	}

	validate(): Promise<void> {
		const childInitProms = this.map((item: PropertyAccess) => item.validate());

		return Promise.all(childInitProms).then(noop);
	}
}