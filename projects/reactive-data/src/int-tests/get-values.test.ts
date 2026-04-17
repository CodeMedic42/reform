import { describe, expect, it } from "@jest/globals";
import Configuration from "../configuration/configuration";
import Data from "../data/data";

const testConfigurationDef = {
	model: {
		type: 'object',
		keys: {
			stringTest: {
				type: 'simple',
			},
			numberTest: {
				type: 'simple',
			},
			booleanTest: {
				type: 'simple',
			},
			objectTest: {
				type: 'object',
				keys: {
					valueA: {
						type: 'simple',
					},
					valueB: {
						type: 'simple',
					},
					valueC: {
						type: 'simple',
					},
				}
			},
			arrayTest: {
				type: 'array',
				items: {
					type: 'object',
					keys: {
						valueA: {
							type: 'simple',
						},
						valueB: {
							type: 'simple',
						},
						valueC: {
							type: 'simple',
						},
					}
				}
			}
		},
	}
};

const testInstValues = {
	stringTest: 'Hello',
	numberTest: 42,
	booleanTest: false,
	objectTest: {
		valueA: 'A',
		valueB: 'B',
		valueC: 'C',
	},
	arrayTest: [
		{ valueA: 1, valueB: 2, valueC: 3 }, 
		{ valueA: 2, valueB: 4, valueC: 6 }, 
		{ valueA: 3, valueB: 6, valueC: 9 }],
};

describe('Configuration', () => {
	it('get value short path', async () => {
		const configuration = new Configuration(testConfigurationDef);

		const data = await Data.build(configuration, testInstValues);

		const stringTestProp = data.getPropertyAt('stringTest');

		expect(stringTestProp?.getValue()).toBe('Hello');
	});

	it('get value long path', async () => {
		const configuration = new Configuration(testConfigurationDef);

		const data = await Data.build(configuration, testInstValues);

		const bazCProp = data.getPropertyAt('arrayTest.2.valueC');

		expect(bazCProp?.getValue()).toBe(9);
	});
});