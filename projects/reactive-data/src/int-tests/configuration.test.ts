import { describe, expect, it } from "@jest/globals";
import { isNil } from "lodash-es";
import Configuration from "../configuration/configuration";
import BaseModel from "../configuration/base-model";
import ObjectModel from "../configuration/object-model";
import SimpleModel from "../configuration/simple-model";
import ArrayModel from "../configuration/array-model";
import Data from "../data/data";
import Property from "../data/property";

const testConfigurationDef = {
	model: {
		type: 'object',
		keys: {
			foo: {
				type: 'simple',
				rules: {
					required: {
						requires: ['faz'],
						attribute: (requiredValues: Property[]) => {
							const [fazValue] = requiredValues;

							return fazValue.getValue() === true;
						},
						validator: (fooValue: Property, attribute: any) => {
							if (!attribute) {
								return null;
							}

							if (isNil(fooValue.getValue())) {
								return 'Foo is required'
							}
							
							return null;
						},
					}
				},
			},
			bar: {
				type: 'simple',
				meta: {
					name: 'Bar Property',
				}
			},
			faz: {
				type: 'simple',
			},
			baz: {
				type: 'array',
				items: {
					type: 'object',
					keys: {
						a: {
							type: 'simple',
						},
						b: {
							type: 'simple',
						},
						c: {
							type: 'simple',
						},
					}
				}
			}
		},
	},
};

const testInstValues = {
	foo: 'Hello',
	bar: 42,
	faz: false,
	baz: [{ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 }, { a: 3, b: 6, c: 9 }],
};

describe('configuration', () => {
	it('Check Instances', () => {
		const configuration = new Configuration(testConfigurationDef);

		expect(configuration).toBeInstanceOf(Configuration);

		const objectModelDef = configuration.getModel();

		expect(objectModelDef).toBeInstanceOf(BaseModel);
		expect(objectModelDef).toBeInstanceOf(ObjectModel);
		expect(objectModelDef.getType()).toBe('object');

		const fooDef = (objectModelDef as ObjectModel).getKey('foo');
		expect(fooDef).toBeInstanceOf(BaseModel);
		expect(fooDef).toBeInstanceOf(SimpleModel);
		expect(fooDef.getType()).toBe('simple');

		const barDef = (objectModelDef as ObjectModel).getKey('bar');
		expect(barDef).toBeInstanceOf(BaseModel);
		expect(barDef).toBeInstanceOf(SimpleModel);
		expect(barDef.getType()).toBe('simple');

		const fazDef = (objectModelDef as ObjectModel).getKey('faz');
		expect(fazDef).toBeInstanceOf(BaseModel);
		expect(fazDef).toBeInstanceOf(SimpleModel);
		expect(fazDef.getType()).toBe('simple');

		const bazDef = (objectModelDef as ObjectModel).getKey('baz');
		expect(bazDef).toBeInstanceOf(BaseModel);
		expect(bazDef).toBeInstanceOf(ArrayModel);
		expect(bazDef.getType()).toBe('array');

		const bazItemsDef = (bazDef as ArrayModel).getItems();
		expect(bazItemsDef).toBeInstanceOf(BaseModel);
		expect(bazItemsDef).toBeInstanceOf(ObjectModel);
		expect(bazItemsDef.getType()).toBe('object');

		const bazItemsADef = (bazItemsDef as ObjectModel).getKey('a');
		expect(bazItemsADef).toBeInstanceOf(BaseModel);
		expect(bazItemsADef).toBeInstanceOf(SimpleModel);
		expect(bazItemsADef.getType()).toBe('simple');

		const bazItemsBDef = (bazItemsDef as ObjectModel).getKey('b');
		expect(bazItemsBDef).toBeInstanceOf(BaseModel);
		expect(bazItemsBDef).toBeInstanceOf(SimpleModel);
		expect(bazItemsBDef.getType()).toBe('simple');

		const bazItemsCDef = (bazItemsDef as ObjectModel).getKey('c');
		expect(bazItemsCDef).toBeInstanceOf(BaseModel);
		expect(bazItemsCDef).toBeInstanceOf(SimpleModel);
		expect(bazItemsCDef.getType()).toBe('simple');
	});

	it('build', async () => {
		const configuration = new Configuration(testConfigurationDef);

		const data = await Data.build(configuration, testInstValues);

		expect(data).toBeInstanceOf(Data);

		const fooProp = data.getPropertyAt('foo');
		expect(fooProp).toBeInstanceOf(Property);
		expect(fooProp?.getModel().getType()).toBe('simple');
		expect(fooProp?.getValue()).toBe('Hello');

		const barProp = data.getPropertyAt('bar');
		expect(barProp).toBeInstanceOf(Property);
		expect(barProp?.getModel().getType()).toBe('simple');
		expect(barProp?.getValue()).toBe(42);

		const fazProp = data.getPropertyAt('faz');
		expect(fazProp).toBeInstanceOf(Property);
		expect(fazProp?.getModel().getType()).toBe('simple');
		expect(fazProp?.getValue()).toBe(false);

		const bazProp = data.getPropertyAt('baz');
		expect(bazProp).toBeInstanceOf(Property);
		expect(bazProp?.getModel().getType()).toBe('array');
		expect(bazProp?.getLength()).toBe(3);

		bazProp?.forEach((bazChildProp, bazChildIndex: number) => {
			expect(bazChildProp).toBeInstanceOf(Property);
			expect(bazChildProp?.getModel().getType()).toBe('object');
			expect(bazChildProp?.getLength()).toBe(3);

			const bazAProp = bazChildProp.getPropertyAt('a');
			expect(bazAProp).toBeInstanceOf(Property);
			expect(bazAProp?.getModel().getType()).toBe('simple');
			expect(bazAProp?.getValue()).toBe(1 * (bazChildIndex + 1));

			const bazBProp = bazChildProp.getPropertyAt('b');
			expect(bazBProp).toBeInstanceOf(Property);
			expect(bazBProp?.getModel().getType()).toBe('simple');
			expect(bazBProp?.getValue()).toBe(2 * (bazChildIndex + 1));

			const bazCProp = bazChildProp.getPropertyAt('c');
			expect(bazCProp).toBeInstanceOf(Property);
			expect(bazCProp?.getModel().getType()).toBe('simple');
			expect(bazCProp?.getValue()).toBe(3 * (bazChildIndex + 1));
		});
	});
});