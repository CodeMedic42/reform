import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import InputValue from '../new-base/input-value';
import InputContainer from '../new-base/input-container';
import StringInput from '../new-base/string-input';
import PropTypes from '../../../common/prop-types';

const TextInputBase = forwardRef((props, ref) => {
	const {
		id,
		className,
		value,
		focusOnMount,
		leftAnnotation,
		rightAnnotation,
		onChange,
		...rest
	} = props;

	useEffect(() => {
		if (focusOnMount) {
			ref.current.focus();
		}
	}, []);

	return (
		<InputContainer
			className={className}
			leftAnnotation={leftAnnotation}
			rightAnnotation={rightAnnotation}
		>
			<InputValue
				value={value}
				onChange={onChange}
			>
				{({ value: baseValue, onChange: baseOnChange }) => (
					<StringInput
						{...rest}
						Component="input"
						ref={ref}
						id={id}
						value={baseValue}
						onChange={baseOnChange}
						type="text"
						className={classnames({
							'has-value': !isNil(baseValue),
						})}
						size="1"
					/>
				)}
			</InputValue>
		</InputContainer>
	);
});

TextInputBase.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	focusOnMount: PropTypes.bool,
	onChange: PropTypes.func,
	value: PropTypes.string,
	leftAnnotation: PropTypes.children,
	rightAnnotation: PropTypes.children,
};

TextInputBase.defaultProps = {
	id: null,
	className: null,
	focusOnMount: false,
	onChange: null,
	value: null,
	leftAnnotation: null,
	rightAnnotation: null,
};

export default TextInputBase;
