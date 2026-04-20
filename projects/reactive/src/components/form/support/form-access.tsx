import { isNil } from 'lodash-es';
import { useEffect, useState } from 'react';
import { Data, Property, RulesStatus, State } from '@reformjs/reactive-data';
import { ApplyFormPropertyConsumer } from '../support/form-context.js';

export interface FormAccessControl<T> {
	property: Property,
	data: Data,
	value: T,
	valid: {
		property: boolean, 
		data: boolean,
	},
	setValue: (newValue: T) => void,
	validation: RulesStatus,
	validateOnBlur: boolean,
}

export interface FormAccessProps<T> { 
	children: (accessControl: FormAccessControl<T>) => React.ReactNode;
	property: Property;
	data: Data;
	validateOnBlur: boolean,
	listenToData: boolean,
	listenToProperty: boolean,
}

function FormAccess(props: FormAccessProps<any>): React.ReactElement | null {
	const {
		children,
		property,
		data,
		listenToData,
		listenToProperty,
		validateOnBlur,
	} = props;

	if (isNil(property)) {
		throw new Error('Property not defined');
	}

	const [value, setValue] = useState(property.getValue());
	const [propertyValid, setPropertyValid] = useState(property.isValid());
	const [dataValid, setDataValid] = useState(data.isValid());

	useEffect(() => {
		if (listenToProperty) {
			property.onChange((prop: Property) => {
				const val = prop.getValue();

				setValue(val);
			});

			property.onStateChange((prop: Property) => {
				if (prop.getState() === State.idle) {
					setPropertyValid(property.isValid());
				}
			});
		}

		if (listenToData) {
			data.onStateChange((state: State) => {
				if (state === State.idle) {
					setDataValid(data.isValid());
				}
			});
		}

		return () => {};
	}, []);

	const validation = property.getRulesStatus();

	return (children({
		property,
		data,
		value,
		valid: {
			property: propertyValid,
			data: dataValid,
		},
		setValue: (newValue: any) => {
			property.setValue(newValue);
		},
		validation,
		validateOnBlur,
	}) ?? null) as React.ReactElement | null;
}

export default ApplyFormPropertyConsumer<any>(FormAccess);
