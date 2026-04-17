import { toPath } from 'lodash-es';
import Configuration from '../configuration/configuration';
import DataControl from './data-control';
import Property from './property';
import PropertyAccess from './property-access';

class Data {
	#dataControl: DataControl;

	private constructor(dataControl: DataControl) {
		if (!(dataControl instanceof DataControl)) {
			throw new Error('Data requires an instance of DataControl');
		}

		this.#dataControl = dataControl;
	}

	static async build(configuration: Configuration, value: any): Promise<Data> {
		const control = new DataControl(configuration, value);

		await control.initialize();

		const data = new Data(control);

		await control.finalize(data);

		return data;
	}

	getPropertyAt(path: string[] | string): Property {
		const segments = toPath(path);

		const propertyAccess = this.#dataControl.getPropertyAccessAt(segments);
		
		return propertyAccess.getInterface();
	}

	onChange(cb: (property: Property) => void) {
		return this.#dataControl.onChange((propertyAccess: PropertyAccess) => {
			cb(propertyAccess.getInterface());
		});
	}

	onChangedAt(path: string | string[], cb: (property: Property) => void) {
		const segments = toPath(path);

		return this.#dataControl.onChangedAt(segments, (propertyAccess: PropertyAccess) => {
			cb(propertyAccess.getInterface());
		});
	}

	onStateChange(listener: Function) {
		return this.#dataControl.onStateChange(listener);
	}

	isValid() {
		 return this.#dataControl.isValid();
	}

	async validate() {
		await this.#dataControl.validate()
	}
}

export default Data;