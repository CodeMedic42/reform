import React, { useCallback, useState } from 'react';
import classnames from 'classnames';
import { noop } from 'lodash-es';
import { Data } from '@reformjs/reactive-data';
import { FormContextProvider } from '../support/form-context.js';
import { isNil } from 'lodash-es';

function perform(func: Function | undefined | null, ...params: any[]) {
	return (func || noop)(...params);
}

interface FormProps {
	id?: string,
	className?: string,
	data: Data,
	children?: any,
	'aria-label'?: string,
	onExecute?: Function,
	validateOnBlur?: boolean,
	validateOnExecute?: boolean,
};

function Form(props: FormProps) {
	const {
		id,
		children,
		'aria-label': ariaLabel,
		className,
		onExecute,
		data,
		validateOnBlur = false,
		validateOnExecute = false,
	} = props;

	const [executed, setExecuted] = useState(false);

	const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setExecuted(true);

		if (validateOnExecute) {
			await data.validate();
		}

		await perform(onExecute);
	}, [onExecute]);

	const ancestorProperty = data.getPropertyAt('');

	if (isNil(ancestorProperty)) {
		throw new Error('Invalid property at root');
	}
	
	return (
		<FormContextProvider
			ancestorProperty={ancestorProperty}
			data={data}
			config={{
				validateOnBlur
			}}
		>
			<form
				id={id}
				className={classnames('re-form', className, { executed })}
				aria-label={ariaLabel}
				onSubmit={handleSubmit}
				noValidate
			>
				{children}
			</form>
		</FormContextProvider>
	);
}

export default Form;
