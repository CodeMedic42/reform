import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import addDays from 'date-fns/addDays';
import startOfToday from 'date-fns/startOfToday';
import DatePicker from '../../../controls/date-picker';
import DropDown from '../../../controls/drop-down';
import InputLabel from '../input-label';
import PropTypes from '../../../../common/prop-types';
import isInvalidDate from '../../../../common/is-invalid-date';

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
		variant,
		fromDate,
		toDate,
		minDate,
		maxDate,
		onSelect,
		// fitToContent,
		Anchor,
		anchorProps = {},
		fitTo,
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
		const newTargetDate = !isInvalidDate ? fromDate : startOfToday();

		setTargetDate(newTargetDate);
		// datePickerRef.current.gotoDate(newTargetDate);
	}, [fromDate]);

	return (
		<InputLabel
			className={classnames(
				'ra-drop-down-input',
				'ra-date-base',
				className,
				{
					'fit-to': !isNil(fitTo)
				}
			)}
			id={id}
			label={label}
			messages={messages}
			failure={failure}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}
			hidden={hidden}
			disabled={disabled}
			variant={variant}
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
						id: inputId,
						title,
						'aria-labelledby': labelledBy,
						'aria-describedby': describedBy,
						required,
						disabled,
						name,
						'aria-label': ariaLabel,
						fitTo,
					}}
				>
					<DatePicker
						ref={datePickerRef}
						fromDate={fromDate}
						toDate={toDate}
						minDate={minDate}
						maxDate={maxDate}
						targetDate={targetDate}
						onSelect={handleSelect}
					/>
				</DropDown>
			)}
		</InputLabel>
	);
}

DateBase.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	label: PropTypes.string,
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
	minDate: PropTypes.instanceOf(Date).isRequired,
	maxDate: PropTypes.instanceOf(Date),
	// variant: Represents Size and other none coloring features.
	variant: PropTypes.string,
	Anchor: PropTypes.elementType.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
    anchorProps: PropTypes.object,
	hidden: PropTypes.bool,
	failure: PropTypes.bool,
	// fitToContent: PropTypes.bool,
	messages: PropTypes.inputMessages,
	'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
	fitTo: PropTypes.string,
};

DateBase.defaultProps = {
	id: null,
	className: null,
	label: null,
	fromDate: null,
	toDate: null,
	maxDate: null,
	onSelect: null,
	onBlur: null,
	onFocus: null,
	title: null,
	'aria-label': null,
	required: null,
	disabled: null,
	name: null,
	anchorProps: null,
	hidden: false,
	failure: false,
	messages: null,
	variant: null,
	'aria-labelledby': null,
    'aria-describedby': null,
	// fitToContent: false,
	fitTo: null,
};

export default DateBase;
