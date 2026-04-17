import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
/* eslint-disable import/no-duplicates */
import addDays from 'date-fns/addDays';
import startOfToday from 'date-fns/startOfToday';
/* eslint-enable import/no-duplicates */

import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import DatePicker from '../../../controls/date-picker/index.js';
import DropDown from '../../../controls/drop-down/index.js';
import InputLabel from '../base-input/input-field-label.js';

interface InputMessagesData {
	general?: string[];
	success?: string[];
	failure?: string[];
}

interface DateBaseProps {
	id?: string | null;
	className?: string | null;
	label?: string | null;
	messages?: InputMessagesData | null;
	title?: string | null;
	failure?: boolean;
	required?: boolean | null;
	hidden?: boolean;
	disabled?: boolean | null;
	name?: string | null;
	onFocus?: (() => void) | null;
	onBlur?: (() => void) | null;
	'aria-label'?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg';
	fromDate?: Date | null;
	toDate?: Date | null;
	onSelect?: ((date: Date) => void) | null;
	Anchor: React.ElementType;
	anchorProps?: Record<string, unknown> | null;
}

function DateBase(props: DateBaseProps): React.ReactElement {
	const {
		id = null,
		className = null,
		label = null,
		messages = null,
		title = null,
		failure = false,
		required = null,
		hidden = false,
		disabled = null,
		name = null,
		onFocus = null,
		onBlur = null,
		'aria-label': ariaLabel = null,
		'aria-labelledby': ariaLabelledby = null,
		'aria-describedby': ariaDescribedby = null,
		size,
		fromDate = null,
		toDate = null,
		onSelect = null,
		Anchor,
		anchorProps = {},
	} = props;

    const dropDownRef = useRef<any>();
	const datePickerRef = useRef<any>();

	const [targetDate, setTargetDate] = useState(!isNil(fromDate) ? fromDate : startOfToday);

	const handleSelect = useCallback((date: Date) => {
		setTargetDate(date);
		if (onSelect) {
			onSelect(date);
		}
	}, [onSelect]);

	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
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
				if (onSelect) {
					onSelect(targetDate as Date);
				}
			}

			if (isNil(targetDate)) {
				// This will prevent the dropdowns natural
				// tendency to close the tray on enter/return.
				event.preventDefault();
			}
		}

		let newTargetDate: Date | null = null;

		if (event.which === 37) { // left arrow
			newTargetDate = addDays(targetDate as Date, -1);
		} else if (event.which === 38) { // up arrow
			newTargetDate = addDays(targetDate as Date, -7);
		} else if (event.which === 39) { // right arrow
			newTargetDate = addDays(targetDate as Date, 1);
		} else if (event.which === 40) { // down arrow
			newTargetDate = addDays(targetDate as Date, 7);
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
			disabled={!!disabled}
			size={size}
		>
			{({ describedBy, labelledBy, inputId, finalId }: { describedBy: string | null; labelledBy: string; inputId: string; finalId: string }) => (
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

export default DateBase;
