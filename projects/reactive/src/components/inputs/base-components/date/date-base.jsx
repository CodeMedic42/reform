import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
/* eslint-disable import/no-duplicates */
import addDays from 'date-fns/addDays';
import startOfToday from 'date-fns/startOfToday';
/* eslint-enable import/no-duplicates */

import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import DatePicker from '../../../controls/date-picker';
import DropDown from '../../../controls/drop-down';
import InputLabel, {
	propTypes as inputLabelPropTypes,
	defaultProps as inputLabelDefaultProps,
} from '../base-input/input-label';

function DateBase(props) {
	const {
		id,
		className,
		label,
		messages,
		title,
		failure,
		required,
		hidden,
		disabled,
		name,
		onFocus,
		onBlur,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		size,
		fromDate,
		toDate,
		onSelect,
		Anchor,
		anchorProps = {},
	} = props;

    const dropDownRef = useRef();
	const datePickerRef = useRef();

	const [targetDate, setTargetDate] = useState(!isNil(fromDate) ? fromDate : startOfToday);

	const handleSelect = useCallback((date) => {
		setTargetDate(date);
		onSelect(date);
	}, [onSelect]);

	const handleKeyDown = useCallback((event) => {
		const open = dropDownRef.current.isOpen();

		if (!open) {
			return;
		}

		if (event.which === 27) {
			// Escape
			// Close the tray.
			dropDownRef.current.setOpen(false);
		}

		if (event.which === 13) {
			// Enter
			// Select the current target item
			if (!isNil(targetDate)) {
				onSelect(targetDate);
			}

			if (isNil(targetDate)) {
				// This will prevent the dropdowns natural
				// tendency to close the tray on enter/return.
				event.preventDefault();
			}
		}

		let newTargetDate = null;

		if (event.which === 37) { // left arrow
			newTargetDate = addDays(targetDate, -1);
		} else if (event.which === 38) { // up arrow
			newTargetDate = addDays(targetDate, -7);
		} else if (event.which === 39) { // right arrow
			newTargetDate = addDays(targetDate, 1);
		} else if (event.which === 40) { // down arrow
			newTargetDate = addDays(targetDate, 7);
		}

		if (!isNil(newTargetDate)) {
			setTargetDate(newTargetDate);

			// This will prevent the arrow keys from scrolling
			event.preventDefault();
		}
	}, [onSelect, targetDate]);

	const handleClosed = useCallback(() => {
		const newTargetDate = !isNil(fromDate) ? fromDate : startOfToday();

		setTargetDate(newTargetDate);
		datePickerRef.current.gotoDate(newTargetDate);
	}, [fromDate]);

	return (
		<InputLabel
			className={classnames(
				'ra-drop-down-input',
				'ra-date-base',
				className,
			)}
			id={id}
			label={label}
			messages={messages}
			failure={failure}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}
			hidden={hidden}
			disabled={disabled}
			size={size}
		>
			{({ describedBy, labelledBy, inputId, finalId }) => (
				<DropDown
					ref={dropDownRef}
					id={`${finalId}-dropdown`}
					trayClassName="ra-date-tray"
					onFocus={onFocus}
					onBlur={onBlur}
					closeTrayOnClick={false}
					disabled={disabled}
					Anchor={Anchor}
					onKeyDown={handleKeyDown}
					onClosed={handleClosed}
					anchorProps={{
						...anchorProps,
						// onChange: handleSelect,
						// fromDate,
						// toDate,
						id: inputId,
						title,
						'aria-labelledby': labelledBy,
						'aria-describedby': describedBy,
						required,
						disabled,
						name,
						size,
						rightIcon: {
							icon: faCalendar,
						},
						'aria-label': ariaLabel,
					}}
				>
					<DatePicker
						ref={datePickerRef}
						fromDate={fromDate}
						toDate={toDate}
						targetDate={targetDate}
						onSelect={handleSelect}
					/>
				</DropDown>
			)}
		</InputLabel>
	);
}

DateBase.propTypes = {
	...inputLabelPropTypes,
	onSelect: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	title: PropTypes.string,
	'aria-label': PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	name: PropTypes.string,
	fromDate: PropTypes.instanceOf(Date),
	toDate: PropTypes.instanceOf(Date),
	Anchor: PropTypes.elementType.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
    anchorProps: PropTypes.object,
};

DateBase.defaultProps = {
	...inputLabelDefaultProps,
	fromDate: null,
	toDate: null,
	onSelect: null,
	onBlur: null,
	onFocus: null,
	title: null,
	'aria-label': null,
	required: null,
	disabled: null,
	name: null,
	anchorProps: null,
};

export default DateBase;
