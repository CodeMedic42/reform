import React, { useCallback } from 'react';
import AsyncValue from '@reformjs/reactive/workflow/async-value';
// import Form from '@reformjs/reactive/form';
import { Configuration, Data, Property } from '@reformjs/reactive-data';
import { buildRequiredRole } from '@reformjs/reactive-data/rules';
import Form, {
	FormGroup,
	FormList,
	FormAccess,
	FormAccessControl,
	controls,
	fields,
} from '@reformjs/reactive/form';
import { toNumber } from 'lodash-es';

const { FormButton } = controls;
const { FormTextField } = fields;

const testConfigurationDef = {
	triggers: {
		// change: true,
	},
	model: {
		type: 'object',
		keys: {
			foo: {
				type: 'simple',
				rules: {
					required: buildRequiredRole('Foo is required', {})
				},
			},
			bar: {
				type: 'simple',
				meta: {
					name: 'Bar Property',
				}
			},
			faz: {
				type: 'object',
				keys: {
					a: {
						type: 'simple',
						rules: {
							required: buildRequiredRole('Faz.a is required', {})
						},
					},
					b: {
						type: 'simple',
					},
					c: {
						type: 'simple',
					},
				}
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
	faz: {
		b: 'B says Hello'
	},
	baz: [{ a: 1, b: 2, c: 3 }, { a: 2, b: 4, c: 6 }, { a: 3, b: 6, c: 9 }],
};

const schema = new Configuration(testConfigurationDef);

interface LoadedComponentProps {
	value: Data;
}

function LoadedComponent(props: LoadedComponentProps) {
	const {
		value: data,
	} = props;

	const handleListAdd = useCallback((event: React.MouseEvent, access: { property: Property }) => {
		access.property.insertValue({ a: 'new' }, access.property.getLength());
	}, []);

	const handleListRemove = useCallback((
		event: React.MouseEvent, 
		access: {
			property: Property,
			data: Data,
		}
	) => {
		const path: string[] = access.property.getPath();

		const index = path.pop();

		const arrayProperty = data.getPropertyAt(path);

		arrayProperty.removeValue(index);
	}, []);

	const handleListItemUp = useCallback((
		event: React.MouseEvent, 
		access: {
			property: Property,
			data: Data,
		}
	) => {
		const path: string[] = access.property.getPath();

		const index: string = path.pop() as string;

		const arrayProperty = data.getPropertyAt(path);

		arrayProperty.moveValue(index, toNumber(index)+1);
	}, []);

	const handleListItemDown = useCallback((
		event: React.MouseEvent, 
		access: {
			property: Property,
			data: Data,
		}
	) => {
		const path: string[] = access.property.getPath();

		const index: string = path.pop() as string;

		const arrayProperty = data.getPropertyAt(path);

		arrayProperty.moveValue(index, toNumber(index)-1);
	}, []);

	return (
		<Form
			data={data}
			validateOnBlur
			validateOnExecute
			onExecute={() => {
				if (data.isValid()) {
					alert('submitted');
				}
			}}
		>
			<FormAccess
				listenToData
			>
				{(access: FormAccessControl<any>) => {
					const {
						data: formData
					} = access;

					const valid = formData.isValid();

					return !valid ? <span>Form Not Valid</span> : null;
				}}
			</FormAccess>
			<FormTextField path="foo" />
			<FormGroup path="faz">
				<FormTextField path="a" />
			</FormGroup>
			<FormList path='baz'>
				<div>
					<FormTextField path="a" />
					<FormButton
						color='primary'
						variant='fill'
						onClick={handleListRemove}
					>
						-
					</FormButton>
					<FormButton
						color='primary'
						variant='fill'
						onClick={handleListItemUp}
					>
						up
					</FormButton>
					<FormButton
						color='primary'
						variant='fill'
						onClick={handleListItemDown}
					>
						down
					</FormButton>
				</div>
			</FormList>
			<FormButton
				path='baz'
				color='primary'
        		variant='fill'
				onClick={handleListAdd}>
				Add
			</FormButton>
			<FormButton
				type='submit'
				color='primary'
        		variant='fill'
			>
				Submit
			</FormButton>
		</Form>
	);
} 

function example() {
	return (
		<div>
			<AsyncValue 
				value={() => Data.build(schema, testInstValues)}
				LoadingComponent={() => <span>Loading</span>}
				LoadedComponent={LoadedComponent}
			/>
		</div>
	);
}

example.storyName = 'General';

export default example;
