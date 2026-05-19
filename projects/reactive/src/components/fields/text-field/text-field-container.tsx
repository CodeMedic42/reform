import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import FieldValue from '../_support/field-value.js';
import FieldContainer from '../_support/field-container.js';
import StringInput from '../_support/string-input.js';

interface TextFieldContainerProps {
	id?: string | null;
	className?: string | null;
	focusOnMount?: boolean;
	onChange?: ((value: string | null) => void) | null;
	value?: string | null;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
	type?: string;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	disabled?: boolean;
}

const TextFieldContainer = forwardRef<any, TextFieldContainerProps>((props, ref) => {
	const {
		id = null,
		className = null,
		value = null,
		focusOnMount = false,
		leftAnnotation = null,
		rightAnnotation = null,
		onChange = null,
		...rest
	} = props;

	useEffect(() => {
		if (focusOnMount) {
			(ref as React.MutableRefObject<any>).current.focus();
		}
	}, []);

	return (
		<FieldContainer
			className={className}
			leftAnnotation={leftAnnotation}
			rightAnnotation={rightAnnotation}
		>
			<FieldValue
				value={value}
				onChange={onChange as ((value: string | number | null) => void) | undefined}
			>
				{({ value: baseValue, onChange: baseOnChange }: { value: string | number | null; onChange: (value: string | number | null) => void }) => (
					<StringInput
						{...rest}
						Component="input"
						ref={ref}
						id={id}
						value={baseValue as string | null}
						onChange={baseOnChange as unknown as (value: string | null) => void}
						type="text"
						className={classnames('ra-field-text-input', {
							'has-value': !isNil(baseValue),
						})}
						size="1"
					/>
				)}
			</FieldValue>
		</FieldContainer>
	);
});

export default TextFieldContainer;
