import React, { forwardRef, useCallback, useMemo, useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import DateRangeSelectFieldContainer from './date-range-select-field-container.js';
import DateSelect from '../_support/date/date-select.js';

interface DateRangeSelectValue {
	from: Date | null;
	to: Date | null;
}

interface DateRangeSelectFieldProps {
	className?: string | null;
	onChange?: ((value: DateRangeSelectValue) => void) | null;
	onBlur?: (() => void) | null;
	onFocus?: (() => void) | null;
	title?: string | null;
	'aria-label'?: string | null;
	required?: boolean | null;
	disabled?: boolean | null;
	name?: string | null;
	value?: DateRangeSelectValue | null;
	minDate?: Date;
	maxDate?: Date | null;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
}

const DateRangeSelectInput = forwardRef<unknown, DateRangeSelectFieldProps>((props, ref) => {
	// } = props;

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

	const fromDate = value?.from ?? null;
	const toDate = value?.to ?? null;

	const [focus, setFocus] = useState<'from' | 'to'>('from');

	const handleSelect = useCallback((date: Date) => {
		const dates: DateRangeSelectValue = {
			from: fromDate,
			to: toDate,
		};

		if (focus === 'from') {
			dates.from = date;
		} else {
			dates.to = date;
		}

		if (!isNil(dates.from) && !isNil(dates.to) && dates.to < dates.from) {
			dates.from = date;
			dates.to = null;

			setFocus('to');
		} else {
			setFocus(focus === 'from' ? 'to' : 'from');
		}

		if (onChange) {
			onChange(dates);
		}
	}, [onChange, fromDate, toDate, focus]);

	const handleFromFocus = useCallback(() => {
		setFocus('from');
	}, []);

	const handleToFocus = useCallback(() => {
		setFocus('to');
	}, []);

	const anchorProps = useMemo(() => ({
		onChange,
		leftAnnotation,
		rightAnnotation,
		fromDate,
		toDate,
		onFromFocus: handleFromFocus,
		onToFocus: handleToFocus,
	}), [fromDate, toDate, onChange, handleFromFocus, handleToFocus, leftAnnotation, rightAnnotation]);

	useImperativeHandle(ref, () => ({
        isValid: () => fromDate! <= toDate!,
    }));

	return (
		<DateSelect
			{...rest}
			className={classnames('ra-date-range-select-field', className)}
			fromDate={fromDate}
			toDate={toDate}
			onSelect={handleSelect}
			Anchor={DateRangeSelectFieldContainer}
			anchorProps={anchorProps}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
});

DateRangeSelectInput.displayName = 'DateRangeSelectInput';

export default DateRangeSelectInput;
