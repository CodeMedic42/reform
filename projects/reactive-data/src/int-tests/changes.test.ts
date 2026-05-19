import { describe, expect, it, jest } from "@jest/globals";
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
		{ valueA: 3, valueB: 6, valueC: 9 }
	],
};

describe('Value Changes', () => {
	describe('Simple Value Changes', () => {
		it('set value', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const stringTestProp = data.getPropertyAt('stringTest');

			stringTestProp?.setValue('World');

			expect(stringTestProp?.getValue()).toBe('World');
		});

		it('set value onChange', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const stringTestProp = data.getPropertyAt('stringTest');

			const handleOnChange = jest.fn();

			const removeListener = stringTestProp!.onChange(handleOnChange);

			stringTestProp!.setValue('World');

			expect(handleOnChange).toHaveBeenCalledWith(stringTestProp);

			handleOnChange.mockClear();
			
			removeListener!();

			stringTestProp!.setValue('Good Bye');

			expect(handleOnChange).not.toHaveBeenCalled();
		});

		it('set value onChange*', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const handleOnTriggerAt = jest.fn();

			const removeListenerAt = data.onChangedAt('stringTest', handleOnTriggerAt);

			const stringTestProp = data.getPropertyAt('stringTest');

			stringTestProp!.setValue('World');

			expect(handleOnTriggerAt).toHaveBeenCalledWith(stringTestProp);

			handleOnTriggerAt.mockClear();
			
			removeListenerAt!();

			stringTestProp!.setValue('Good Bye');

			expect(handleOnTriggerAt).not.toHaveBeenCalled();
		});

		it('set value onChange, no difference', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const stringTestProp = data.getPropertyAt('stringTest');

			const handleOnChange = jest.fn();

			stringTestProp!.onChange(handleOnChange);

			stringTestProp!.setValue('Hello');

			expect(handleOnChange).not.toHaveBeenCalled();
		});

		it('set value onChange*, no difference', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const handleOnTriggerAt = jest.fn();

			data.onChangedAt('stringTest', handleOnTriggerAt);

			const stringTestProp = data.getPropertyAt('stringTest');

			stringTestProp!.setValue('Hello');

			expect(handleOnTriggerAt).not.toHaveBeenCalled();
		});
	});

	describe('Object Value Changes', () => {
		it('set value', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const objectTestProp = data.getPropertyAt('objectTest');

			objectTestProp?.setValue({
				valueA: 'X',
				valueB: 'Y',
				valueC: 'Z',
			});

			expect(objectTestProp?.getValue()).toEqual({
				valueA: 'X',
				valueB: 'Y',
				valueC: 'Z',
			});

			expect(objectTestProp?.getPropertyAt('valueA')?.getValue()).toEqual('X');
			expect(objectTestProp?.getPropertyAt('valueB')?.getValue()).toEqual('Y');
			expect(objectTestProp?.getPropertyAt('valueC')?.getValue()).toEqual('Z');
		});

		it('set value onChange', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const objectTestProp = data.getPropertyAt('objectTest');
			const valueAProp = data.getPropertyAt('objectTest.valueA');
			const valueBProp = data.getPropertyAt('objectTest.valueB');
			const valueCProp = data.getPropertyAt('objectTest.valueC');

			const handleObjectOnChange = jest.fn();
			const removeObjectListener = objectTestProp!.onChange(handleObjectOnChange);

			const handleValueAOnChange = jest.fn();
			const removeValueAObjectListener = objectTestProp!.onChange(handleValueAOnChange);

			const handleValueBOnChange = jest.fn();
			const removeValueBObjectListener = objectTestProp!.onChange(handleValueBOnChange);

			const handleValueCOnChange = jest.fn();
			const removeValueCObjectListener = objectTestProp!.onChange(handleValueCOnChange);

			objectTestProp?.setValue({
				valueA: 'X',
				valueB: 'Y',
				valueC: 'Z',
			});

			expect(handleObjectOnChange).toHaveBeenCalledWith(objectTestProp);
			expect(handleValueAOnChange).toHaveBeenCalledWith(valueAProp);
			expect(handleValueBOnChange).toHaveBeenCalledWith(valueBProp);
			expect(handleValueCOnChange).toHaveBeenCalledWith(valueCProp);

			removeObjectListener();
			removeValueBObjectListener();

			objectTestProp?.setValue({
				valueA: 'R',
				valueB: 'S',
				valueC: 'T',
			});

			expect(handleObjectOnChange).not.toHaveBeenCalledWith();
			expect(handleValueAOnChange).toHaveBeenCalledWith(valueAProp);
			expect(handleValueBOnChange).not.toHaveBeenCalledWith();
			expect(handleValueCOnChange).toHaveBeenCalledWith(valueCProp);

			removeValueAObjectListener();
			removeValueCObjectListener();

			objectTestProp?.setValue({
				valueA: 'L',
				valueB: 'M',
				valueC: 'N',
			});

			expect(handleObjectOnChange).not.toHaveBeenCalledWith();
			expect(handleValueAOnChange).not.toHaveBeenCalledWith();
			expect(handleValueBOnChange).not.toHaveBeenCalledWith();
			expect(handleValueCOnChange).not.toHaveBeenCalledWith();
		});

		it('set value onChange*', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const handleOnTriggerAtObjectTest = jest.fn();
			const handleOnTriggerAtValueA = jest.fn();
			const handleOnTriggerAtValueB = jest.fn();
			const handleOnTriggerAtValueC = jest.fn();

			const removeListenerAtObjectTest = data.onChangedAt('objectTest', handleOnTriggerAtObjectTest);
			const removeListenerAtValueA = data.onChangedAt('objectTest.valueA', handleOnTriggerAtValueA);
			// @typescript-eslint/no-unused-vars
			const removeListenerAtValueB = data.onChangedAt('objectTest.valueB', handleOnTriggerAtValueB);
			const removeListenerAtValueC = data.onChangedAt('objectTest.valueC', handleOnTriggerAtValueC);

			const objectTestProp = data.getPropertyAt('objectTest');
			const valueAProp = data.getPropertyAt('objectTest.valueA');
			const valueBProp = data.getPropertyAt('objectTest.valueB');
			const valueCProp = data.getPropertyAt('objectTest.valueC');

			objectTestProp?.setValue({
				valueA: 'X',
				valueB: 'B',
				valueC: 'Z',
			});

			expect(handleOnTriggerAtObjectTest).toHaveBeenCalledWith(objectTestProp);
			expect(handleOnTriggerAtValueA).toHaveBeenCalledWith(valueAProp);
			// valueB did not change and should have been triggered.
			expect(handleOnTriggerAtValueB).not.toHaveBeenCalled();
			expect(handleOnTriggerAtValueC).toHaveBeenCalledWith(valueCProp);

			handleOnTriggerAtObjectTest.mockClear();
			handleOnTriggerAtValueA.mockClear();
			handleOnTriggerAtValueB.mockClear();
			handleOnTriggerAtValueC.mockClear();

			removeListenerAtObjectTest!();
			removeListenerAtValueA!();
			removeListenerAtValueC!();

			objectTestProp?.setValue({
				valueA: 'X',
				valueB: 'Y',
				valueC: 'Z',
			});

			expect(handleOnTriggerAtObjectTest).not.toHaveBeenCalled();
			expect(handleOnTriggerAtValueA).not.toHaveBeenCalled();
			expect(handleOnTriggerAtValueB).toHaveBeenCalledWith(valueBProp);
			expect(handleOnTriggerAtValueC).not.toHaveBeenCalled();
		});

		it('set value onChange, no change', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const objectTestProp = data.getPropertyAt('objectTest');
			// @typescript-eslint/no-unused-vars
			const valueAProp = data.getPropertyAt('objectTest.valueA');
			// @typescript-eslint/no-unused-vars
			const valueBProp = data.getPropertyAt('objectTest.valueB');
			// @typescript-eslint/no-unused-vars
			const valueCProp = data.getPropertyAt('objectTest.valueC');

			const handleObjectOnChange = jest.fn();
			objectTestProp!.onChange(handleObjectOnChange);

			const handleValueAOnChange = jest.fn();
			objectTestProp!.onChange(handleValueAOnChange);

			const handleValueBOnChange = jest.fn();
			objectTestProp!.onChange(handleValueBOnChange);

			const handleValueCOnChange = jest.fn();
			objectTestProp!.onChange(handleValueCOnChange);

			objectTestProp?.setValue({
				valueA: 'A',
				valueB: 'B',
				valueC: 'C',
			});

			expect(handleObjectOnChange).not.toHaveBeenCalledWith();
			expect(handleValueAOnChange).not.toHaveBeenCalledWith();
			expect(handleValueBOnChange).not.toHaveBeenCalledWith();
			expect(handleValueCOnChange).not.toHaveBeenCalledWith();
		});
	});

	describe('Array Value Changes', () => {
		it('array', async () => {
			const configuration = new Configuration(testConfigurationDef);

			const data = await Data.build(configuration, testInstValues);

			const arrayTestProp = data.getPropertyAt('arrayTest');

			arrayTestProp?.setValue([
				{ valueA: 2, valueB: 4, valueC: 6 }, 
				{ valueA: 3, valueB: 6, valueC: 9 },
				{ valueA: 4, valueB: 8, valueC: 12 },
			]);

			expect(arrayTestProp?.getPropertyAt('0.valueA')?.getValue()).toEqual(2);
			expect(arrayTestProp?.getPropertyAt('0.valueB')?.getValue()).toEqual(4);
			expect(arrayTestProp?.getPropertyAt('0.valueC')?.getValue()).toEqual(6);

			expect(arrayTestProp?.getPropertyAt('1.valueA')?.getValue()).toEqual(3);
			expect(arrayTestProp?.getPropertyAt('1.valueB')?.getValue()).toEqual(6);
			expect(arrayTestProp?.getPropertyAt('1.valueC')?.getValue()).toEqual(9);

			expect(arrayTestProp?.getPropertyAt('2.valueA')?.getValue()).toEqual(4);
			expect(arrayTestProp?.getPropertyAt('2.valueB')?.getValue()).toEqual(8);
			expect(arrayTestProp?.getPropertyAt('2.valueC')?.getValue()).toEqual(12);
		});
	});
});
