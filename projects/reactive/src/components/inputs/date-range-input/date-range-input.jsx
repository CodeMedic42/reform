import React, { forwardRef, useCallback, useMemo, useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import DateRangeInputAnchor from './date-range-input-anchor';
import DateBase from '../new-base/date/date-base';
import PropTypes from '../../../common/prop-types';

const DateRangeInput = forwardRef((props, ref) => {
	// } = props;

	const {
		value,
		className,
		onChange,
		leftAnnotation,
		rightAnnotation,
		minDate,
		maxDate,
		...rest
	} = props;

	const fromDate = value?.from ?? null;
	const toDate = value?.to ?? null;

	const [focus, setFocus] = useState('from');

	const handleSelect = useCallback((date) => {
		const dates = {
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

		onChange(dates);
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
        isValid: () => fromDate <= toDate,
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

DateRangeInput.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	title: PropTypes.string,
	'aria-label': PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	name: PropTypes.string,
	value: PropTypes.shape({
		from: PropTypes.instanceOf(Date),
		to: PropTypes.instanceOf(Date),
	}),
	minDate: PropTypes.instanceOf(Date),
	maxDate: PropTypes.instanceOf(Date),
	leftAnnotation: PropTypes.children,
	rightAnnotation: PropTypes.children,
};

DateRangeInput.defaultProps = {
	className: null,
	value: null,
	minDate: new Date(1900, 0, 1),
	maxDate: null,
	onChange: null,
	onBlur: null,
	onFocus: null,
	title: null,
	'aria-label': null,
	required: null,
	disabled: null,
	name: null,
	leftAnnotation: null,
	rightAnnotation: null,
};

export default DateRangeInput;
