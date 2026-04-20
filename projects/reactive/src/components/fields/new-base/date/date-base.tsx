import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import addDays from 'date-fns/addDays';
import startOfToday from 'date-fns/startOfToday';
/* eslint-enable import/no-duplicates */
import DatePicker from '../../../controls/date-picker/index.js';
import DropDown from '../../../controls/drop-down/index.js';
import InputLabel from '../input-field-label.js';
import isInvalidDate from '../../../../common/is-invalid-date.js';

interface InputMessagesData {
	general?: string[];
	success?: string[];
	failure?: string[];
}

interface DateBaseProps {
	id?: string | null;
	className?: string | null;
	label?: string | null;
	onSelect?: ((date: Date) => void) | null;
	onBlur?: (() => void) | null;
	onFocus?: (() => void) | null;
	title?: string | null;
	'aria-label'?: string | null;
	required?: boolean | null;
	disabled?: boolean | null;
	name?: string | null;
	fromDate?: Date | null;
	toDate?: Date | null;
	minDate: Date;
	maxDate?: Date | null;
	variant?: string | null;
	Anchor: React.ElementType;
	anchorProps?: Record<string, unknown> | null;
	hidden?: boolean;
	failure?: boolean;
	messages?: InputMessagesData | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	fitTo?: string | null;
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
		variant = null,
		fromDate = null,
		toDate = null,
		minDate,
		maxDate = null,
		onSelect = null,
		// fitToContent,
		Anchor,
		anchorProps = {},
		fitTo = null,
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
		const newTargetDate = !isInvalidDate ? fromDate : startOfToday();

		setTargetDate(newTargetDate ?? startOfToday());
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
			disabled={!!disabled}
			variant={variant}
		>
			{({ describedBy, labelledBy, inputId, finalId }: { describedBy: string | null; labelledBy: string; inputId: string; finalId: string }) => (
				<DropDown
					ref={dropDownRef}
					id={`${finalId}-dropdown`}
					trayClassName="ra-date-tray"
					onFocus={onFocus ?? undefined}
					onBlur={onBlur ?? undefined}
					closeTrayOnClick={false}
					disabled={disabled ?? undefined}
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

export default DateBase;
