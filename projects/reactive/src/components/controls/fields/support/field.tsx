import React from 'react';
import classNames from 'classnames';
import FieldMessages from './field-messages.js';
import Control from '../../support/control.js';

export type FieldProps = {
	className?: string;
	children?: React.ReactNode;
	messages?: string[];
};

function Field(props: FieldProps) {
	const {
		className,
		messages,
		children,
	} = props;

	return (
		<Control<'div'>
			ControlComponent='div'
			className={classNames('re-field', className)}
		>
			{children}
			<FieldMessages messages={messages} />
		</Control>
	);
}

export default Field;