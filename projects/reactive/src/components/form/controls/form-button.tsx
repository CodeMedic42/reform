import React from "react";
import classNames from "classnames";
import { isNil } from "lodash-es";
import { Property, Data } from "@reformjs/reactive-data";
import Button from "../../controls/button/index.js";
import { ButtonProps } from "../../controls/button/button.types.js";
import FormAccess, { FormAccessControl } from "../support/form-access.js";

interface FormButtonProps extends Omit<ButtonProps, 'onClick'> {
	path?: string,
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, form: { property: Property, data: Data}) => void,
}

function FormButton(props: FormButtonProps) {
	const {
		path,
		children,
		onClick,
		className,
		...rest
	} = props;

	return (
		<FormAccess path={path}>
			{(accessControl: FormAccessControl<any>) => {
				const {
					data,
					property,
				} = accessControl;

				const handleOnClick = !isNil(onClick)
					? (event: React.MouseEvent<HTMLButtonElement>) => onClick(event, { property, data })
					: undefined;

				const innerClassName = classNames(
					're-form-button',
					className,
				);

				return (
					<Button
						className={innerClassName}
						onClick={handleOnClick}
						{...rest}
					>
						{children}
					</Button>		
				);
			}}
		</FormAccess>
	);
}

export default FormButton;