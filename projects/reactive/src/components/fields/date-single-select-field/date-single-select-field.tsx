import React, { useMemo } from 'react';
import classnames from 'classnames';
import DateSelect from '../_support/date-select-field/date-select-field.js';
import DateSelectFieldContainer from './date-single-select-field-container.js';

export interface DateSingleSelectFieldProps {
	className?: string | null;
	onChange?: ((value: Date | null) => void) | null;
	onBlur?: (() => void) | null;
	onFocus?: (() => void) | null;
	title?: string | null;
	'aria-label'?: string | null;
	required?: boolean | null;
	disabled?: boolean | null;
	name?: string | null;
	value?: Date | null;
	minDate?: Date;
	maxDate?: Date | null;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
}

function DateSingleSelectField(props: DateSingleSelectFieldProps): React.ReactElement {
	const {
		value = null,
		className = null,
		onChange = null,
		leftAnnotation = null,
		rightAnnotation = null,
		minDate = new Date(1900, 0, 1),
		maxDate = null,
		...rest
	} = props;

	const anchorProps = useMemo(() => ({
		onChange,
		value,
		leftAnnotation,
		rightAnnotation,
	}), [value, onChange, leftAnnotation, rightAnnotation]);

	return (
		<DateSelect
			{...rest}
			className={classnames('ra-date-select-field-field', className)}
			fromDate={value}
			onSelect={onChange as ((date: Date) => void) | null}
			Anchor={DateSelectFieldContainer}
			anchorProps={anchorProps}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
}

export default DateSingleSelectField;
