import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import InputLabel from '../new-base/input-label';
import PropTypes from '../../../common/prop-types';
import TextInputBase from './text-input-base';

const TextInput = forwardRef((props, ref) => {
	const {
		className,
		id,
		label,
		messages,
		failure,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		hidden,
		disabled,
		variant,
		...rest
	} = props;

	const inputRef = useRef();

	useImperativeHandle(ref, () => ({
        getInputRef: () => inputRef,
		focus: () => {
			if (disabled) {
				return;
			}

			inputRef.current.focus();
		},
    }), [disabled]);

	return (
		<InputLabel
			className={classnames('ra-text-input', className)}
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
			{({ describedBy, labelledBy, inputId }) => (
				<TextInputBase
					{...rest}
					type="text"
					id={inputId}
					aria-labelledby={labelledBy}
					aria-describedby={describedBy}
					disabled={disabled}
				/>
			)}
		</InputLabel>
	);
});

TextInput.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	// variant: Represents Size and other none coloring features.
    variant: PropTypes.string,
	'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
	hidden: PropTypes.bool,
	failure: PropTypes.bool,
	messages: PropTypes.inputMessages,
};

TextInput.defaultProps = {
	id: null,
	className: null,
	label: null,
	disabled: false,
	variant: null,
	'aria-labelledby': null,
    'aria-describedby': null,
	hidden: false,
	failure: false,
	messages: null,
};

export default TextInput;
