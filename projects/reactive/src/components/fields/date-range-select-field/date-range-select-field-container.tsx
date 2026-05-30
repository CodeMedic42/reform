import React, { useCallback } from 'react';
import applyAnchorBinding from '../../arrangement/drop-down/anchor-binding.js';
import DateFieldValue from '../_support/date-select-field/date-field-value.js';
import buildId from '../../../common/build-id.js';
import FieldContainer from '../_support/field-container.js';

interface DateRangeSelectValue {
	from: Date | null;
	to: Date | null;
}

interface DateRangeSelectFieldContainerProps {
	id?: string | null;
	title?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	required?: boolean;
	disabled?: boolean;
	name?: string | null;
	size?: string | null;
	'aria-label'?: string | null;
	fromDate?: Date | null;
	toDate?: Date | null;
	onChange?: ((value: DateRangeSelectValue) => void) | null;
	onFromFocus: () => void;
	onToFocus: () => void;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
}

function DateRangeSelectFieldContainer(props: DateRangeSelectFieldContainerProps): React.ReactElement {
	const {
		id = null,
		title = null,
		// 'aria-labelledby': ariaLabeledBy,
		// 'aria-describedby': ariaDescribedBy,
		// required,
		// disabled,
		name = null,
		// size,
		'aria-label': ariaLabel = null,
		fromDate = null,
		toDate = null,
		onChange = null,
		onFromFocus,
		onToFocus,
		leftAnnotation = null,
		rightAnnotation = null,
		...rest
	} = props;

	const handleFromChange = useCallback((newFrom: Date | null) => {
		if (onChange) {
			onChange({
				from: newFrom,
				to: toDate!,
			});
		}
	}, [onChange, toDate]);

	const handleToChange = useCallback((newTo: Date | null) => {
		if (onChange) {
			onChange({
				from: fromDate!,
				to: newTo,
			});
		}
	}, [onChange, fromDate]);

	return (
		<FieldContainer
			className="ra-date-range-select-container"
			leftAnnotation={leftAnnotation}
			rightAnnotation={rightAnnotation}
		>
			<DateFieldValue
				{...rest}
				id={buildId(id, 'from')}
				className="from-date"
				title={buildId(title, 'from')}
				name={buildId(name, 'from')}
				// size={size}
				value={fromDate}
				onChange={handleFromChange}
				// required={required}
				// disabled={disabled}
				// aria-labelledby={ariaLabeledBy}
				// aria-describedby={ariaDescribedBy}
				aria-label={buildId(ariaLabel, 'from')}
				onFocus={onFromFocus}
			/>
			{/* <span className="ra-date-range-dash">-</span> */}
			<DateFieldValue
				{...rest}
				id={buildId(id, 'to')}
				className="to-date"
				title={buildId(title, 'to')}
				name={buildId(name, 'to')}
				// size={size}
				value={toDate}
				onChange={handleToChange}
				// required={required}
				// disabled={disabled}
				// aria-labelledby={ariaLabeledBy}
				// aria-describedby={ariaDescribedBy}
				aria-label={buildId(ariaLabel, 'to')}
				onFocus={onToFocus}
			/>
		</FieldContainer>
	);
}

export default applyAnchorBinding(DateRangeSelectFieldContainer, {
	focusSelector: '.input-container input',
});
