import React, { memo, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import {
	PaletteColor,
	PaletteShade,
	getColorInfo,
} from '../../../common/color-list.js';
import { getDefaultSize } from './utils.js';

interface ChipClickEvent {
	event: React.MouseEvent<HTMLButtonElement>;
	data: unknown;
}

export interface ChipProps {
	id?: string | null;
	className?: string | null;
	color?: PaletteColor | null;
	shade?: PaletteShade | null;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null;
	disabled?: boolean;
	floating?: boolean;
	children?: React.ReactNode;
	variant?: 'rectangle' | 'pill' | null;
	bordered?: boolean;
	onClick?: ((event: ChipClickEvent) => void) | null;
	eventData?: unknown;
	asButton?: boolean;
}

const Chip = memo(forwardRef<{ focus: () => void }, ChipProps>((props, ref) => {
	const {
		id = null,
		className = null,
		children = null,
		color = null,
		shade = '200',
		size = 'md',
		floating = false,
		variant = 'rectangle',
		bordered = false,
		onClick = null,
		disabled = false,
		asButton = false,
		eventData,
	} = props;

	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useImperativeHandle(ref, () => ({
		focus: () => {
			if (isNil(onClick)) {
				return;
			}

			const { current } = buttonRef;

			if (isNil(current)) {
				// eslint-disable-next-line no-console
				console.warn('Attempting to focus on an unmounted component');
				return;
			}

			current.focus();
		},
	}), [onClick]);

	const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		if (isNil(onClick)) {
			return;
		}

		onClick({ event, data: eventData });
	}, [onClick, eventData]);

	const { colorClasses } = getColorInfo({
		color,
		shade,
		enableBackground: true,
		enableBorder: bordered,
		colorRequired: false,
	});

	const variantClass = !isNil(variant)
		? `variant-${variant}`
		: 'variant-rectangle';

	const finalClassName = classnames(
		'ra-chip',
		variantClass,
		colorClasses,
		`size-${getDefaultSize(size)}`,
		className,
		{
			'box-shadow-16dp': floating,
			disabled,
		},
	);

	if (!isNil(onClick) || asButton) {
		return (
			<button
				id={id ?? undefined}
				className={finalClassName}
				type="button"
				onClick={handleClick}
				disabled={disabled}
				ref={buttonRef}
			>
				{children}
			</button>
		);
	}

	return (
		<span id={id ?? undefined} className={finalClassName}>
			{children}
		</span>
	);
}));

Chip.displayName = 'Chip';

export default Chip;
