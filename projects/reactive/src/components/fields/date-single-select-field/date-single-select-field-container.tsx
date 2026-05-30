import React from 'react';
import applyAnchorBinding from '../../arrangement/drop-down/anchor-binding.js';
import DateFieldValue from '../_support/date-select-field/date-field-value.js';
import buildId from '../../../common/build-id.js';
import FieldContainer from '../_support/field-container.js';

interface DateSelectFieldContainerProps {
	id?: string | null;
	title?: string | null;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	required?: boolean;
	disabled?: boolean;
	name?: string | null;
	size?: string | null;
	'aria-label'?: string | null;
	value?: Date | null;
	onChange?: ((value: Date | null) => void) | null;
	leftAnnotation?: React.ReactNode;
	rightAnnotation?: React.ReactNode;
}

function DateSelectFieldContainer(props: DateSelectFieldContainerProps): React.ReactElement {
	const {
		id = null,
		title = null,
		'aria-labelledby': ariaLabeledBy = null,
		'aria-describedby': ariaDescribedBy = null,
		required = false,
		disabled = false,
		name = null,
		size = null,
		'aria-label': ariaLabel = null,
		value = null,
		onChange = null,
		leftAnnotation = null,
		rightAnnotation = null,
		// ...rest
	} = props;

	// const date = !isNil(value) ? format(value, 'MM / dd / yyyy') : null;

	return (
		<FieldContainer
			leftAnnotation={leftAnnotation}
			rightAnnotation={rightAnnotation}
			// ...rest
		>
			<DateFieldValue
				id={buildId(id, 'from')}
				title={buildId(title, 'from')}
				name={buildId(name, 'from')}
				size={size}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				aria-labelledby={ariaLabeledBy}
				aria-describedby={ariaDescribedBy}
				aria-label={buildId(ariaLabel, 'from')}
			/>
		</FieldContainer>
	);
}

export default applyAnchorBinding(DateSelectFieldContainer, {
	focusSelector: '.input-container input',
});
