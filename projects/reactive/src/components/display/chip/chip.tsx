import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import {
	Color,
	PaletteShade,
	getColorInfo,
} from '../../../common/color-list.js';
import { getDefaultSize } from './utils.js';

interface ChipClickEvent {
	event: React.MouseEvent<HTMLButtonElement>;
	meta: unknown;
}

interface ChipProps {
	id?: string | null;
	className?: string | null;
	color?: Color | null;
	shade?: PaletteShade | null;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null;
	disabled?: boolean;
	floating?: boolean;
	children?: React.ReactNode;
	variant?: 'rectangle' | 'pill' | null;
	onClick?: ((event: ChipClickEvent) => void) | null;
	onClickMeta?: unknown;
	asButton?: boolean;
}

class Chip extends PureComponent<ChipProps> {
	private buttonRef: React.RefObject<HTMLButtonElement | null>;

	constructor(props: ChipProps) {
		super(props);

		this.buttonRef = React.createRef();

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		const { onClick, onClickMeta } = this.props;

		if (isNil(onClick)) {
			return;
		}

		onClick({ event, meta: onClickMeta });
	}

	focus(): void {
		const { onClick } = this.props;

		if (isNil(onClick)) {
			return;
		}

		const { current } = this.buttonRef;

		if (isNil(current)) {
			// eslint-disable-next-line no-console
			console.warn('Attempting to focus on an unmounted component');

			return;
		}

		current.focus();
	}

	render(): React.ReactNode {
		const {
			id = null,
			className = null,
			children = null,
			color = null,
			shade = 'lighter',
			size = 'md',
			floating = false,
			variant = 'rectangle',
			onClick = null,
			disabled = false,
			asButton = false,
		} = this.props;

		const { colorClasses } = getColorInfo({
			color,
			shade,
			enableBackground: true,
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
					onClick={this.handleClick}
					disabled={disabled}
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
	}
}

export default Chip;
