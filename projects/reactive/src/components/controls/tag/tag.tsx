import React, { memo, useCallback } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { PaletteColor, PaletteShade } from '../../../common/color-list.js';
import Chip from '../../display/chip/chip.js';
import Icon from '../../display/icon/index.js';

export interface TagClearEvent {
	event: React.MouseEvent<HTMLButtonElement>;
	meta: unknown;
}

export interface TagProps {
	id?: string | null;
	className?: string | null;
	color?: PaletteColor | null;
	shade?: PaletteShade | null;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | null;
	floating?: boolean;
	children?: React.ReactNode;
	onClear?: ((event: TagClearEvent) => void) | null;
	onClearMeta?: unknown;
	variant?: 'rectangle' | 'pill';
	clearType?: 'normal' | 'inverse';
	tabIndex?: string | null;
	disabled?: boolean;
	'aria-label'?: string;
}

function Tag(props: TagProps): React.ReactNode {
	const {
		id = null,
		className = null,
		children = null,
		color,
		shade = '200',
		size = null,
		floating = false,
		variant = 'rectangle',
		onClear = null,
		onClearMeta = null,
		clearType = 'normal',
		tabIndex = null,
		disabled = false,
		'aria-label': ariaLabel = 'Remove',
	} = props;

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			if (isNil(onClear)) {
				return;
			}

			onClear({ event, meta: onClearMeta });
		},
		[onClear, onClearMeta],
	);

	return (
		<Chip
			id={id}
			className={classnames(`ra-removable-chip`, className)}
			color={color}
			shade={shade}
			size={size}
			floating={floating}
			variant={variant}
		>
			<span>{children}</span>
			<button
				className={classnames('remove-btn', {
					'circle-icon': clearType === 'inverse',
				})}
				type="button"
				onClick={handleClick}
				tabIndex={tabIndex != null ? Number(tabIndex) : undefined}
				disabled={disabled}
				aria-label={ariaLabel}
			>
				<Icon
					icon={clearType === 'inverse' ? faCircleXmark : faXmark}
				/>
			</button>
		</Chip>
	);
}

export default memo(Tag);
