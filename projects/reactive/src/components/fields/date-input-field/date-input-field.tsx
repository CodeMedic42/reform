import React, { useMemo } from 'react';
import classnames from 'classnames';
import DateBase from '../new-base/date/date-base.js';
import DateInputAnchor from './date-input-field-anchor.js';

interface DateInputProps {
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
	[key: string]: unknown;
}

function DateInput(props: DateInputProps): React.ReactElement {
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
		<DateBase
			{...rest}
			className={classnames('ra-date-input', className)}
			fromDate={value}
			onSelect={onChange as ((date: Date) => void) | null}
			Anchor={DateInputAnchor}
			anchorProps={anchorProps}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
}

export default DateInput;
