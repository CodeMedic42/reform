import React, { useMemo } from 'react';
import classnames from 'classnames';
import DateBase from '../new-base/date/date-base';
import DateInputAnchor from './date-input-anchor';
import PropTypes from '../../../common/prop-types';

function DateInput(props) {
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
			onSelect={onChange}
			Anchor={DateInputAnchor}
			anchorProps={anchorProps}
			minDate={minDate}
			maxDate={maxDate}
		/>
	);
}

DateInput.propTypes = {
	className: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	title: PropTypes.string,
	'aria-label': PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	name: PropTypes.string,
	value: PropTypes.instanceOf(Date),
	minDate: PropTypes.instanceOf(Date),
	maxDate: PropTypes.instanceOf(Date),
	leftAnnotation: PropTypes.children,
	rightAnnotation: PropTypes.children,
};

DateInput.defaultProps = {
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

export default DateInput;
