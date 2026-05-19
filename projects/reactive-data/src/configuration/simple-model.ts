import BaseModel, { BuildOptions } from './base-model';
import PropertyAccess from '../data/property-access';
import SimpleValue from '../data/simple-value';
import { registerModel } from './model-registry';

class SimpleModel extends BaseModel {
	build(options: BuildOptions): PropertyAccess {
		const {
			initial,
			dataControl,
			path,
		} = options;

		const propertyValue: SimpleValue = new SimpleValue({
			initial,
			model: this,
			path,
			dataControl,
		});

		return new PropertyAccess({
			value: propertyValue
		});
	}
}

// Register this model type
registerModel('simple', SimpleModel);

export default SimpleModel;