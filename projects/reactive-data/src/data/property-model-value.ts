import BaseModel from "../configuration/base-model";
import DataControl from "./data-control";
import PropertyValue from "./property-value";

export type PropertyModelValueOptions<Sch> = {
	dataControl: DataControl;
	path: string[];
	model: Sch,
};

export default abstract class PropertyModelValue<Sch extends BaseModel> extends PropertyValue{
	#model: Sch;

	#dataControl: DataControl;

	#path: string[];

	constructor(options: PropertyModelValueOptions<Sch>) {
		super();
		
		const {
			model,
			path,
			dataControl,
		} = options;

		this.#model = model;
		this.#dataControl = dataControl;
		this.#path = path;
	}

	getModel(): Sch {
		return this.#model;
	}

	getDataControl() {
		return this.#dataControl;
	}

	getPath() {
		return [...this.#path];
	}
}