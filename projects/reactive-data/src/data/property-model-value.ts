import BaseModel from "../configuration/base-model";
import DataControl from "./data-control";
import PropertyValue from "./property-value";

export type PropertyModelValueOptions<sch> = {
	dataControl: DataControl;
	path: string[];
	model: sch,
};

export default abstract class PropertyModelValue<sch extends BaseModel> extends PropertyValue{
	#model: sch;
	#dataControl: DataControl;
	#path: string[];

	constructor(options: PropertyModelValueOptions<sch>) {
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

	getModel(): sch {
		return this.#model;
	}

	getDataControl() {
		return this.#dataControl;
	}

	getPath() {
		return [...this.#path];
	}
}