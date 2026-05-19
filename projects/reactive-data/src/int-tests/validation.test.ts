import { describe, expect, it, jest } from "@jest/globals";
import { cloneDeep, forEach, isNil } from "lodash-es";
import Configuration from "../configuration/configuration";
import Data from "../data/data";
import Property from "../data/property";

const testConfigurationDef = {
	model: {
		type: 'object',
		keys: {
			foo: {
				type: 'simple',
				rules: {},
			},
			bar: {
				type: 'simple',
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

const testInstValues: { 
	bar: number; 
	faz: boolean; 
	baz: { a: number; b: number; c: number }[];
	foo?: string 
} = {
	bar: 42,
	faz: false,
	baz: [{ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 }, { a: 3, b: 6, c: 9 }],
};

function getInvalidValue() {
	return testInstValues;
}

function getValidValue() {
	const testValues = cloneDeep(testInstValues);

	testValues.foo = 'Hello';

	return testValues;
}

describe('Validation', () => {
	const validationMessage = 'Foo is required';

	function getTestConfigurationDef() {
		const configurationDef = cloneDeep(testConfigurationDef);

		configurationDef.model.keys.foo.rules = {
			required: {
				validator: (fooValue: Property, attribute: any) => {
					expect(attribute).toBe(undefined);

					const value = fooValue.getValue();

					if (isNil(value)) {
						return validationMessage;
					}
					
					return null;
				}
			}
		};

		return configurationDef;
	}

	it('Check Initial Validation when invalid', async () => {
		const configuration = new Configuration(getTestConfigurationDef());

		const data = await Data.build(configuration, getInvalidValue());

		expect(data.isValid()).toBe(true);

		const fooProp = data.getPropertyAt('foo');

		const results = fooProp!.getRulesStatus();

		const {
			required: {
				attribute,
				enabled,
				message,
			}
		} = results;

		expect(attribute).toBe(undefined);
		expect(enabled).toBe(true);
		expect(message).toBe(null);
	});

	it('Check Initial Validation when valid', async () => {
		const configuration = new Configuration(getTestConfigurationDef());

		const data = await Data.build(configuration, getValidValue());

		expect(data.isValid()).toBe(true);

		const fooProp = data.getPropertyAt('foo');

		const results = fooProp!.getRulesStatus();

		const {
			required: {
				attribute,
				enabled,
				message,
			}
		} = results;

		expect(attribute).toBe(undefined);
		expect(enabled).toBe(true);
		expect(message).toBe(null);
	});
	
	describe('Rules with only validator component', () => {
		describe('Validate only on demand', () => {
			it('Check when initially invalid', async () => {
				const configuration = new Configuration(getTestConfigurationDef());

				const data = await Data.build(configuration, getInvalidValue());

				await data.validate();

				const fooProp = data.getPropertyAt('foo');

				const results = fooProp!.getRulesStatus();

				const {
					required: {
						attribute,
						enabled,
						message,
					}
				} = results;

				expect(attribute).toBe(undefined);
				expect(enabled).toBe(true);
				expect(message).toBe(validationMessage);
			});

			it('Check when initially valid', async () => {
				const configuration = new Configuration(getTestConfigurationDef());

				const data = await Data.build(configuration, getValidValue());

				await data.validate();

				const fooProp = data.getPropertyAt('foo');

				const results = fooProp!.getRulesStatus();

				const {
					required: {
						attribute,
						enabled,
						message,
					}
				} = results;

				expect(attribute).toBe(undefined);
				expect(enabled).toBe(true);
				expect(message).toBe(null);
			});
		});

		describe('Validate on initialize', () => {
			function getTestConfigurationDefWithOnInitialize() {
				const configurationDef = getTestConfigurationDef();

				// @ts-expect-error:
				configurationDef.model.keys.foo.rules.required.triggers = {
					initialize: true
				};
				
				return configurationDef;
			}

			it('Check when initially invalid', async () => {
				const configuration = new Configuration(getTestConfigurationDefWithOnInitialize());

				const data = await Data.build(configuration, getInvalidValue());

				expect(data.isValid()).toBe(false);

				const fooProp = data.getPropertyAt('foo');

				const results = fooProp!.getRulesStatus();

				const {
					required: {
						attribute,
						enabled,
						message,
					}
				} = results;
				

				expect(attribute).toBe(undefined);
				expect(enabled).toBe(true);
				expect(message).toBe(validationMessage);
			});

			it('Check when initially valid', async () => {
				const configuration = new Configuration(getTestConfigurationDefWithOnInitialize());

				const data = await Data.build(configuration, getValidValue());

				expect(data.isValid()).toBe(true);

				const fooProp = data.getPropertyAt('foo');

				const results = fooProp!.getRulesStatus();

				const {
					required: {
						attribute,
						enabled,
						message,
					}
				} = results;

				expect(attribute).toBe(undefined);
				expect(enabled).toBe(true);
				expect(message).toBe(null);
			});
		});

		describe('Validate on change', () => {
			function getTestConfigurationDefWithOnChange() {
				const configurationDef = getTestConfigurationDef();

				// @ts-expect-error:
				configurationDef.model.keys.foo.rules.required.triggers = {
					change: true
				};
				
				return configurationDef;
			}

			describe('Check when initially valid', () => {
				it('and then set to valid', async () => {
					const configuration = new Configuration(getTestConfigurationDefWithOnChange());

					const data = await Data.build(configuration, getValidValue());

					const fooProp = data.getPropertyAt('foo');

					fooProp?.setValue('Hello2');

					const results = fooProp!.getRulesStatus();

					const {
						required: {
							attribute,
							enabled,
							message,
						}
					} = results;

					expect(attribute).toBe(undefined);
					expect(enabled).toBe(true);
					expect(message).toBe(null);
				});

				it('and then set to invalid', async () => {
					const configuration = new Configuration(getTestConfigurationDefWithOnChange());

					const data = await Data.build(configuration, getValidValue());

					const fooProp = data.getPropertyAt('foo');

					return new Promise((resolve) => {
						const handleStateChange = jest.fn((state: string) => {
							if (state === 'idle') {
								resolve(handleStateChange);
							}
						});

						// Need to wait for validation to end.
						data.onStateChange(handleStateChange);

						fooProp?.setValue(null);
					}).then((handleStateChange) => {
						// @ts-expect-error
						expect(handleStateChange.mock.calls[0][0]).toBe('validating');
						// @ts-expect-error
						expect(handleStateChange.mock.calls[1][0]).toBe('idle');
						
						const results = fooProp!.getRulesStatus();

						const {
							required: {
								attribute,
								enabled,
								message,
							}
						} = results;

						expect(attribute).toBe(undefined);
						expect(enabled).toBe(true);
						expect(message).toBe(validationMessage);
					});
				});
			});

			describe('Check when initially invalid', () => {
				it('and then set to valid', async () => {				
					const configuration = new Configuration(getTestConfigurationDefWithOnChange());

					const data = await Data.build(configuration, getInvalidValue());

					const fooProp = data.getPropertyAt('foo');

					return new Promise((resolve) => {
						const handleStateChange = jest.fn((state: string) => {
							if (state === 'idle') {
								resolve(handleStateChange);
							}
						});

						// Need to wait for validation to end.
						data.onStateChange(handleStateChange);

						fooProp?.setValue('Hello2');
					}).then((handleStateChange) => {
						// @ts-expect-error
						expect(handleStateChange.mock.calls[0][0]).toBe('validating');
						// @ts-expect-error
						expect(handleStateChange.mock.calls[1][0]).toBe('idle');
						
						const results = fooProp!.getRulesStatus();

						const {
							required: {
								attribute,
								enabled,
								message,
							}
						} = results;

						expect(attribute).toBe(undefined);
						expect(enabled).toBe(true);
						expect(message).toBe(null);
					});
				});

				it('and then set to invalid', async () => {				
					const configuration = new Configuration(getTestConfigurationDefWithOnChange());

					const data = await Data.build(configuration, getInvalidValue());

					const fooProp = data.getPropertyAt('foo');

					return new Promise((resolve) => {
						const handleStateChange = jest.fn((state: string) => {
							if (state === 'idle') {
								resolve(handleStateChange);
							}
						});

						// Need to wait for validation to end.
						data.onStateChange(handleStateChange);

						fooProp?.setValue(null);
					}).then((handleStateChange) => {
						// @ts-expect-error
						expect(handleStateChange.mock.calls[0][0]).toBe('validating');
						// @ts-expect-error
						expect(handleStateChange.mock.calls[1][0]).toBe('idle');
						
						const results = fooProp!.getRulesStatus();

						const {
							required: {
								attribute,
								enabled,
								message,
							}
						} = results;

						expect(attribute).toBe(undefined);
						expect(enabled).toBe(true);
						expect(message).toBe(validationMessage);
					});
				});
			});
		});
	});

	describe('Rules with only enabled component', () => {
		interface ExpectedResults {
			validationToRun?: boolean;
			attribute: any;
			enabled: boolean;
			message: string | null;
		};

		interface EnabledTestCase {
			title: string;
			enabledValue: boolean | (() => boolean);
			onDemand?: {
				whenValid?: ExpectedResults;
				whenInvalid?: ExpectedResults;
			};
			onTrigger?: {
				whenValid?: ExpectedResults;
				whenInvalid?: ExpectedResults;
			};
			onInit?: {
				whenValid?: ExpectedResults;
				whenInvalid?: ExpectedResults;
			};
			onChange?: {
				whenValid?: {
					setValid?: ExpectedResults;
					setInvalid?: ExpectedResults;
				};
				whenInvalid?: {
					setValid?: ExpectedResults;
					setInvalid?: ExpectedResults;
				};
			};
		}

		const enabledTests: EnabledTestCase[] = [
			{
				title: 'Enabled is false',
				enabledValue: false,
				onDemand: {
					whenValid: {
						attribute: undefined,
						enabled: false,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: false,
						message: null,
					}
				},
				onTrigger: {
					whenValid: {
						validationToRun: false,
						attribute: undefined,
						enabled: false,
						message: null,
					},
					whenInvalid: {
						validationToRun: false,
						attribute: undefined,
						enabled: false,
						message: null,
					}
				},
				onInit: {
					whenValid: {
						attribute: undefined,
						enabled: false,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: false,
						message: null,
					}
				},
				onChange: {
					whenValid: {
						setValid: {
							attribute: undefined,
							enabled: false,
							message: null,
						},
						setInvalid: {
							attribute: undefined,
							enabled: false,
							message: null,
						}
					},
					whenInvalid: {
						setValid: {
							validationToRun: false,
							attribute: undefined,
							enabled: false,
							message: null,
						},
						setInvalid: {
							attribute: undefined,
							enabled: false,
							message: null,
						}
					}
				},
			},
			{
				title: 'Enabled is true',
				enabledValue: true,
				onDemand: {
					whenValid: {
						attribute: undefined,
						enabled: true,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: true,
						message: validationMessage,
					}
				},
				onInit: {
					whenValid: {
						attribute: undefined,
						enabled: true,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: true,
						message: validationMessage,
					}
				},
				onChange: {
					whenValid: {
						setValid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: null,
						},
						setInvalid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: validationMessage,
						}
					},
					whenInvalid: {
						setValid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: null,
						},
						setInvalid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: validationMessage,
						}
					}
				},
			},
			{
				title: 'Enabled is false',
				enabledValue: () => false,
				onDemand: {
					whenValid: {
						attribute: undefined,
						enabled: false,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: false,
						message: null,
					}
				},
				onInit: {
					whenValid: {
						attribute: undefined,
						enabled: false,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: false,
						message: null,
					}
				},
				onChange: {
					whenValid: {
						setValid: {
							attribute: undefined,
							enabled: false,
							message: null,
						},
						setInvalid: {
							attribute: undefined,
							enabled: false,
							message: null,
						}
					},
					whenInvalid: {
						setValid: {
							validationToRun: false,
							attribute: undefined,
							enabled: false,
							message: null,
						},
						setInvalid: {
							attribute: undefined,
							enabled: false,
							message: null,
						}
					}
				},
			},
			{
				title: 'Enabled is true',
				enabledValue: () => true,
				onDemand: {
					whenValid: {
						attribute: undefined,
						enabled: true,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: true,
						message: validationMessage,
					}
				},
				onInit: {
					whenValid: {
						attribute: undefined,
						enabled: true,
						message: null,
					},
					whenInvalid: {
						attribute: undefined,
						enabled: true,
						message: validationMessage,
					}
				},
				onChange: {
					whenValid: {
						setValid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: null,
						},
						setInvalid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: validationMessage,
						}
					},
					whenInvalid: {
						setValid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: null,
						},
						setInvalid: {
							validationToRun: true,
							attribute: undefined,
							enabled: true,
							message: validationMessage,
						}
					}
				},
			},
		];

		forEach(enabledTests, (testData) => {
			describe(testData.title, () => {
				function getTestConfigurationDefWithEnabled() {
					const configurationDef = getTestConfigurationDef();

					// @ts-expect-error:
					configurationDef.model.keys.foo.rules.required.enabled = testData.enabledValue;

					return configurationDef;
				}

				if (!isNil(testData.onDemand)) {
					describe('Validate only on demand', () => {
						if (!isNil(testData.onDemand!.whenInvalid)) {
							it('Check when initially invalid', async () => {
								const configuration = new Configuration(getTestConfigurationDefWithEnabled());

								const data = await Data.build(configuration, getInvalidValue());

								await data.validate();

								const fooProp = data.getPropertyAt('foo');

								const results = fooProp!.getRulesStatus();

								const {
									required: {
										attribute,
										enabled,
										message,
									}
								} = results;

								expect(attribute).toBe(testData.onDemand!.whenInvalid!.attribute);
								expect(enabled).toBe(testData.onDemand!.whenInvalid!.enabled);
								expect(message).toBe(testData.onDemand!.whenInvalid!.message);
							});
						}

						if (!isNil(testData.onDemand!.whenValid)) {
							it('Check when initially valid', async () => {
								const configuration = new Configuration(getTestConfigurationDefWithEnabled());

								const data = await Data.build(configuration, getValidValue());

								await data.validate();

								const fooProp = data.getPropertyAt('foo');

								const results = fooProp!.getRulesStatus();

								const {
									required: {
										attribute,
										enabled,
										message,
									}
								} = results;

								expect(attribute).toBe(testData.onDemand!.whenValid!.attribute);
								expect(enabled).toBe(testData.onDemand!.whenValid!.enabled);
								expect(message).toBe(testData.onDemand!.whenValid!.message);
							});
						}
					});
				}

				if (!isNil(testData.onInit)) {
					describe('Validate on initialize', () => {
						function getTestConfigurationDefWithOnInitialize() {
							const configurationDef = getTestConfigurationDefWithEnabled();

							// @ts-expect-error:
							configurationDef.model.keys.foo.rules.required.triggers = {
								initialize: true
							};
							
							return configurationDef;
						}

						if (!isNil(testData.onInit!.whenInvalid)) {
							it('Check when initially invalid', async () => {
								const configuration = new Configuration(getTestConfigurationDefWithOnInitialize());

								const data = await Data.build(configuration, getInvalidValue());

								const fooProp = data.getPropertyAt('foo');

								const results = fooProp!.getRulesStatus();

								const {
									required: {
										attribute,
										enabled,
										message,
									}
								} = results;

								expect(attribute).toBe(testData.onInit!.whenInvalid!.attribute);
								expect(enabled).toBe(testData.onInit!.whenInvalid!.enabled);
								expect(message).toBe(testData.onInit!.whenInvalid!.message);
							});
						}

						if (!isNil(testData.onInit!.whenValid)) {
							it('Check when initially valid', async () => {
								const configuration = new Configuration(getTestConfigurationDefWithOnInitialize());

								const data = await Data.build(configuration, getValidValue());

								const fooProp = data.getPropertyAt('foo');

								const results = fooProp!.getRulesStatus();

								const {
									required: {
										attribute,
										enabled,
										message,
									}
								} = results;

								expect(attribute).toBe(testData.onInit!.whenValid!.attribute);
								expect(enabled).toBe(testData.onInit!.whenValid!.enabled);
								expect(message).toBe(testData.onInit!.whenValid!.message);
							});
						}
					});
				}

				if (!isNil(testData.onChange)) {
					describe('Validate on change', () => {
						function getTestConfigurationDefWithOnChange() {
							const configurationDef = getTestConfigurationDefWithEnabled();

							// @ts-expect-error:
							configurationDef.model.keys.foo.rules.required.triggers = {
								change: true
							};
							
							return configurationDef;
						}

						if (!isNil(testData.onChange!.whenValid)) {
							describe('Check when initially valid', () => {
								if (!isNil(testData.onChange!.whenValid?.setValid)) {
									it('and then set to valid', async () => {
										const expected = testData.onChange!.whenValid!.setValid;

										const configuration = new Configuration(getTestConfigurationDefWithOnChange());

										const data = await Data.build(configuration, getValidValue());

										const fooProp = data.getPropertyAt('foo');

										return new Promise((resolve) => {
											const handleStateChange = jest.fn((state: string) => {
												if (state === 'idle') {
													resolve(handleStateChange);
												}
											});

											// Need to wait for validation to end.
											data.onStateChange(handleStateChange);

											if (!expected!.validationToRun) {
												setTimeout(() => {
													resolve(handleStateChange);
												}, 50);
											}

											fooProp?.setValue('Hello2');
										}).then((handleStateChange) => {
											if (expected!.validationToRun) {
												// @ts-expect-error
												expect(handleStateChange.mock.calls[0][0]).toBe('validating');
												// @ts-expect-error
												expect(handleStateChange.mock.calls[1][0]).toBe('idle');
											} else {
												// @ts-expect-error
												expect(handleStateChange.mock.calls.length).toBe(0);
											}
											
											const results = fooProp!.getRulesStatus();

											const {
												required: {
													attribute,
													enabled,
													message,
												}
												} = results;

											// @ts-expect-error
											expect(attribute).toBe(expected.attribute);
											// @ts-expect-error
											expect(enabled).toBe(expected.enabled);
											// @ts-expect-error
											expect(message).toBe(expected.message);
										});
									});
								}

								if (!isNil(testData.onChange!.whenValid?.setInvalid)) {
									it('and then set to invalid', async () => {
										const expected = testData.onChange!.whenValid!.setInvalid;

										const configuration = new Configuration(getTestConfigurationDefWithOnChange());

										const data = await Data.build(configuration, getValidValue());

										const fooProp = data.getPropertyAt('foo');

										return new Promise((resolve) => {
											const handleStateChange = jest.fn((state: string) => {
												if (state === 'idle') {
													resolve(handleStateChange);
												}
											});

											// Need to wait for validation to end.
											data.onStateChange(handleStateChange);

											if (!expected!.validationToRun) {
												setTimeout(() => {
													resolve(handleStateChange);
												}, 50);
											}

											fooProp?.setValue(null);
										}).then((handleStateChange) => {
											if (expected!.validationToRun) {
												// @ts-expect-error
												expect(handleStateChange.mock.calls[0][0]).toBe('validating');
												// @ts-expect-error
												expect(handleStateChange.mock.calls[1][0]).toBe('idle');
											} else {
												// @ts-expect-error
												expect(handleStateChange.mock.calls.length).toBe(0);
											}
											
											const results = fooProp!.getRulesStatus();

											const {
												required: {
													attribute,
													enabled,
													message,
												}
												} = results;

											// @ts-expect-error
											expect(attribute).toBe(expected.attribute);
											// @ts-expect-error
											expect(enabled).toBe(expected.enabled);
											// @ts-expect-error
											expect(message).toBe(expected.message);
										});
									});
								}
							});
						}

						if (!isNil(testData.onChange!.whenInvalid)) {
							describe('Check when initially invalid', () => {
								if (!isNil(testData.onChange!.whenInvalid!.setValid)) {
									it('and then set to valid', async () => {
										const expected = testData.onChange!.whenInvalid!.setValid;

										const configuration = new Configuration(getTestConfigurationDefWithOnChange());

										const data = await Data.build(configuration, getInvalidValue());

										const fooProp = data.getPropertyAt('foo');

										return new Promise((resolve) => {
											const handleStateChange = jest.fn((state: string) => {
												if (state === 'idle') {
													resolve(handleStateChange);
												}
											});

											// Need to wait for validation to end.
											data.onStateChange(handleStateChange);

											if (!expected!.validationToRun) {
												setTimeout(() => {
													resolve(handleStateChange);
												}, 50);
											}

											fooProp?.setValue('Hello2');
										}).then((handleStateChange) => {
											if (expected!.validationToRun) {
												// @ts-expect-error
												expect(handleStateChange.mock.calls[0][0]).toBe('validating');
												// @ts-expect-error
												expect(handleStateChange.mock.calls[1][0]).toBe('idle');
											} else {
												// @ts-expect-error
												expect(handleStateChange.mock.calls.length).toBe(0);
											}
											
											const results = fooProp!.getRulesStatus();

											const {
												required: {
													attribute,
													enabled,
													message,
												}
											} = results;

											// @ts-expect-error
											expect(attribute).toBe(expected.attribute);
											// @ts-expect-error
											expect(enabled).toBe(expected.enabled);
											// @ts-expect-error
											expect(message).toBe(expected.message);
										});
									});
								}

								if (!isNil(testData.onChange!.whenInvalid?.setInvalid)) {
									it('and then set to invalid', async () => {
										const expected = testData.onChange!.whenInvalid!.setInvalid;

										const configuration = new Configuration(getTestConfigurationDefWithOnChange());

										const data = await Data.build(configuration, getInvalidValue());

										const fooProp = data.getPropertyAt('foo');

										return new Promise((resolve) => {
											const handleStateChange = jest.fn((state: string) => {
												if (state === 'idle') {
													resolve(handleStateChange);
												}
											});

											// Need to wait for validation to end.
											data.onStateChange(handleStateChange);

											if (!expected!.validationToRun) {
												setTimeout(() => {
													resolve(handleStateChange);
												}, 50);
											}

											fooProp?.setValue(null);
										}).then((handleStateChange) => {
											if (expected!.validationToRun) {
												// @ts-expect-error
												expect(handleStateChange.mock.calls[0][0]).toBe('validating');
												// @ts-expect-error
												expect(handleStateChange.mock.calls[1][0]).toBe('idle');
											} else {
												// @ts-expect-error
												expect(handleStateChange.mock.calls.length).toBe(0);
											}
											
											const results = fooProp!.getRulesStatus();

											const {
												required: {
													attribute,
													enabled,
													message,
												}
											} = results;

											// @ts-expect-error
											expect(attribute).toBe(expected.attribute);
											// @ts-expect-error
											expect(enabled).toBe(expected.enabled);
											// @ts-expect-error
											expect(message).toBe(expected.message);
										});
									});
								}
							});
						}
					});
				}
			});
		});
	});
});