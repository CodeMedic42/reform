import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import MaskedInput from 'react-text-mask';
import BaseCursorInput from './base-cursor-input';
import InputBase from './input-base';
import PropTypes from '../../../../common/prop-types';

const BaseMaskInput = forwardRef((props, ref) => {
	const {
		focusOnMount,
		disabled,
		id,
		className,
		value,
		onChange,
		onClear,
		size,
		rightIcon,
		showFocused,
		leftIcon,
		mask,
		showMask,
		guide,
		keepCharPositions,
		...rest
	} = props;

	const inputRef = useRef();

	useImperativeHandle(ref, () => ({
        focus: () => {
			if (!disabled) {
				inputRef.current.inputElement.focus();
			}
		},
		getInputElement: () => inputRef.current.inputElement,
    }));

	useEffect(
		() => {
			if (!disabled && focusOnMount && inputRef && inputRef.current) {
				inputRef.current.inputElement.focus();
			}
		},
		[]
	);

	return (
		<BaseCursorInput
			id={id}
			className={className}
			value={value}
			valueType="string"
			disabled={disabled}
			onChange={onChange}
			onClear={onClear}
			size={size}
			leftIcon={leftIcon}
			rightIcon={rightIcon}
		>
			{({ value: baseValue, onChange: baseOnChange }) => (
				<InputBase
					ref={inputRef}
					Component={MaskedInput}
					id={id}
					value={baseValue}
					onChange={baseOnChange}
					type="text"
					className={classnames({
						focus: showFocused,
						'has-value': !isNil(baseValue),
					})}
					mask={mask}
					showMask={showMask}
					guide={guide}
					keepCharPositions={keepCharPositions}
					{...rest}
				/>
			)}
		</BaseCursorInput>
	);
});

BaseMaskInput.displayName = 'BaseMaskInput';

BaseMaskInput.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    leftIcon: PropTypes.shape({
        icon: PropTypes.icon.isRequired,
        onClick: PropTypes.func,
    }),
    rightIcon: PropTypes.shape({
        icon: PropTypes.icon.isRequired,
        onClick: PropTypes.func,
        overrideClear: PropTypes.bool,
    }),
	focusOnMount: PropTypes.bool,
	showFocused: PropTypes.bool,
	mask: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.instanceOf(RegExp),
			]),
		),
	]).isRequired,
	showMask: PropTypes.bool,
	guide: PropTypes.bool,
	keepCharPositions: PropTypes.bool,
};

BaseMaskInput.defaultProps = {
	focusOnMount: false,
	showFocused: false,
	guide: false,
	keepCharPositions: false,
	showMask: null,
	id: null,
	className: null,
    value: null,
    disabled: false,
    onClear: null,
    leftIcon: null,
    rightIcon: null,
    size: 'md',
    onChange: noop,
};

export default BaseMaskInput;
