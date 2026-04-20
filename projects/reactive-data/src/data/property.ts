import { toPath } from 'lodash-es';
import Data from './data';
import PropertyValue from './property-value';
import PropertyAccess from './property-access';

export type PropertyOptions = {
	value: PropertyValue;
};

// Internally called PropertyInterface
export default class Property {
	#propertyAccess: PropertyAccess;

	constructor(propertyAccess: PropertyAccess) {
		this.#propertyAccess = propertyAccess;
	}

	getUuid() {
		return this.#propertyAccess.getUuid();
	}

	getModel() {
		return this.#propertyAccess.getModel();
	}

	getData(): Data {
		const dataControl = this.#propertyAccess.getDataControl();

		return dataControl.getInterface();
	}

	getPath(): string[] {
		return this.#propertyAccess.getPath();
	}

	getValue() {
		return this.#propertyAccess.getValue();
	}

	setValue(newValue: any): boolean {
		const changed = this.#propertyAccess.setValue(newValue, true);

		return changed;
	}

	insertValue(value: any, keydex: any) {
		const changed = this.#propertyAccess.insertValue(value, keydex, true);

		return changed;
	}

	removeValue(keydex: any) {
		const changed = this.#propertyAccess.removeValue(keydex, true);

		return changed;
	}

	moveValue(fromKeydex: number | string, toKeydex: number | string) {
		const changed = this.#propertyAccess.moveValue(fromKeydex, toKeydex, true);

		return changed;
	}

	getPropertyAt(path: string | string[]): Property {
		const segments = toPath(path);

		const propertyAccess = this.#propertyAccess.getPropertyAccessAt(segments);

		return propertyAccess.getInterface(); 
	}

	getLength() {
		return this.#propertyAccess.getLength();
	}

	forEach(cb: (item: any, keydex: any) => boolean | undefined | void) {
		this.#propertyAccess.forEach((propertyAccess: PropertyAccess, keyDex: any) => cb(propertyAccess.getInterface(), keyDex));
	}

	map<T>(cb: (item: any, keydex: any) => T): T[] {
		return this.#propertyAccess.map<T>((propertyAccess: PropertyAccess, keyDex: any) => cb(propertyAccess.getInterface(), keyDex));
	}

	isEqual(comparator: any) {
		return this.#propertyAccess.isEqual(comparator);
	}

	onChange(cb: Function) {
		return this.#propertyAccess.onChange(cb);
	}

	onStateChange(listener: Function) {
		return this.#propertyAccess.onStateChange(listener);
	}

	getState() {
		return this.#propertyAccess.getState();
	}

	getRulesStatus() {
		return this.#propertyAccess.getRulesStatus();
	}

	isValid() {
		return this.#propertyAccess.isValid();
	}

	dispose() {
		this.#propertyAccess.dispose();
	}

	validate() {
		return this.#propertyAccess.validate();
	}
}