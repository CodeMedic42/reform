import React, { forwardRef, useCallback, useMemo, useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import DateRangeInputAnchor from './date-range-input-field-anchor.js';
import DateBase from '../new-base/date/date-base.js';

interface DateRangeValue {
	from: Date | null;
	to: Date | null;
}

interface DateRangeInputProps {
	className?: string | null;
	onChange?: ((value: DateRangeValue) => void) | null;
	onBlur?: (() => void) | null;
	onFocus?: (() => void) | null;
	title?: string | null;
	'aria-label'?: string | null;
	required?: boolean | null;
	disabled?: boolean | null;
	name?: string | null;
	value?: DateRangeValue | null;
	minDate?: Date;
	maxDate?: Date | null;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
}

const DateRangeInput = forwardRef<unknown, DateRangeInputProps>((props, ref) => {
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
		const dates: DateRangeValue = {
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
		<DateBase
			{...rest}
			className={classnames('ra-date-range-input', className)}
			fromDate={fromDate}
			toDate={toDate}
			onSelect={handleSelect}
			Anchor={DateRangeInputAnchor}
			anchorProps={anchorProps}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
});

DateRangeInput.displayName = 'DateRangeInput';

export default DateRangeInput;
