import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { isNil, noop } from 'lodash-es';
import MaskedInput from 'react-text-mask';
import BaseCursorInput from './base-cursor-input-field.js';
import InputBase from './input-field-base.js';

interface IconConfig {
	icon: unknown;
	onClick?: (() => void) | null;
}

interface RightIconConfig extends IconConfig {
	overrideClear?: boolean;
}

interface BaseMaskInputProps {
	id?: string | null;
	className?: string | null;
	value?: string | number | null;
	disabled?: boolean;
	onChange?: ((value: string | null) => void) | null;
	onClear?: (() => void) | null;
	size?: 'sm' | 'md' | 'lg';
	leftIcon?: IconConfig | null;
	rightIcon?: RightIconConfig | null;
	focusOnMount?: boolean;
	showFocused?: boolean;
	mask: ((value: string) => Array<string | RegExp>) | Array<string | RegExp>;
	showMask?: boolean | null;
	guide?: boolean;
	keepCharPositions?: boolean;
	placeholder?: string;
	autoComplete?: string;
}

const BaseMaskInput = forwardRef<unknown, BaseMaskInputProps>((props, ref) => {
	const {
		focusOnMount = false,
		disabled = false,
		id = null,
		className = null,
		value = null,
		onChange = noop,
		onClear = null,
		size = 'md',
		rightIcon = null,
		showFocused = false,
		leftIcon = null,
		mask,
		showMask = null,
		guide = false,
		keepCharPositions = false,
		...rest
	} = props;

	const inputRef = useRef<any>();

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
			disabled={disabled}
			onChange={onChange ?? undefined}
			onClear={onClear}
			size={size}
			leftIcon={leftIcon}
			rightIcon={rightIcon}
		>
			{({ value: baseValue, onChange: baseOnChange }: { value: string | number | null; onChange: (value: string | null) => void }) => (
				<InputBase
					ref={inputRef}
					Component={MaskedInput}
					id={id ?? undefined}
					value={baseValue as string | null}
					onChange={baseOnChange}
					type="text"
					className={classnames({
						focus: showFocused,
						'has-value': !isNil(baseValue),
					})}
					mask={mask}
					showMask={showMask ?? undefined}
					guide={guide}
					keepCharPositions={keepCharPositions}
					{...rest}
				/>
			)}
		</BaseCursorInput>
	);
});

BaseMaskInput.displayName = 'BaseMaskInput';

export default BaseMaskInput;
