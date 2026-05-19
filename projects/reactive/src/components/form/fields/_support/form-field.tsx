import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { findIndex, isNil, reduce } from "lodash-es";
import FormAccess, { FormAccessControl } from "../../_support/form-access.js";

interface FormControlProps {
	path: string,
	className?: string,
	ControlComponent: React.ComponentType<any>,
	validateOnBlur?: boolean,
	nativeAttributes: string[],
	onBlur?: Function | null,
}

function FormField(props: FormControlProps) {
	const {
		path,
		className,
		ControlComponent,
		validateOnBlur,
		nativeAttributes,
		onBlur,

		...rest
	} = props;

	return (
		<FormAccess path={path} listenToProperty>
			{(accessControl: FormAccessControl<any>) => {
				const {
					value,
					valid,
					setValue,
					validation,
					property,
					validateOnBlur: rootValidateOnBlur,
				} = accessControl;

				const messages: string[] = [];

				const validationAttributes = reduce(
					validation,
					(acc: Record<string, any>, rulesStatus, key) => {
						const attributeValue = !isNil(rulesStatus.attribute)
							? rulesStatus.attribute
							: rulesStatus.enabled;

						if (findIndex(nativeAttributes, (v) => v === key) >= 0) {
							acc[key] = attributeValue;	
						}else {
							acc[`data-${key}`] = attributeValue;
						}

						if (!isNil(rulesStatus.message)) {
							messages.push(rulesStatus.message);
						}
						
						return acc;
					},
					{} as Record<string, any>
				);

				const [touched, setTouched] = useState(false);

				const handleBlur = useCallback(
					(...args: any[]) => {
						if (isNil(validateOnBlur)? rootValidateOnBlur : validateOnBlur) {
							property.validate();
						}

						setTouched(true);

						if (!isNil(onBlur)) {
							onBlur(...args);
						}
					},
					[validateOnBlur, rootValidateOnBlur]
				);

				const innerClassName = classNames(
					're-form-field',
					className,
					{
						valid,
						invalid: !valid,
						touched,
					}
				);

					return React.createElement(ControlComponent, {
						...rest,
						className: innerClassName,
						value,
						onChange: setValue,
						onBlur: handleBlur,
						messages,
						attributes: validationAttributes,
					});				
			}}
		</FormAccess>
	);
}

export default FormField;