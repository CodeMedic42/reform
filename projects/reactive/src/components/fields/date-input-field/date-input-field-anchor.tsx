import React from 'react';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.jsx';
import DateInputBase from '../new-base/date/date-input-base.js';
import buildId from '../../../common/build-id.js';
import InputContainer from '../new-base/input-field-container.js';

interface DateInputAnchorProps {
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

function DateInputAnchor(props: DateInputAnchorProps): React.ReactElement {
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
		<InputContainer
			leftAnnotation={leftAnnotation}
			rightAnnotation={rightAnnotation}
			// ...rest
		>
			<DateInputBase
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
		</InputContainer>
	);
}

export default applyAnchorBinding(DateInputAnchor, {
	focusSelector: '.input-container input',
});
