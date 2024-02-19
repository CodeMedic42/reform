import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { colorPropType, shadePropType } from '../../../common/color-list';
import Chip from './chip';
import Icon from '../icon';

function RemovableChip(props) {
	const {
		id,
		className,
		children,
		color,
		shade,
		size,
		floating,
		variant,
		onClear,
		onClearMeta,
		clearType,
		tabIndex,
		disabled,
		'aria-label': ariaLabel
	} = props;

	const handleClick = useCallback(
		(event) => {
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
				tabIndex={tabIndex}
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

RemovableChip.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	color: colorPropType.isRequired,
	shade: shadePropType,
	size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
	floating: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.node),
	]),
	onClear: PropTypes.func,
	// eslint-disable-next-line react/forbid-prop-types
	onClearMeta: PropTypes.any,
	variant: PropTypes.oneOf(['rectangle', 'pill']),
	clearType: PropTypes.oneOf(['normal', 'inverse']),
	tabIndex: PropTypes.string,
	disabled: PropTypes.bool,
	'aria-label': PropTypes.string,
};

RemovableChip.defaultProps = {
	id: null,
	className: null,
	shade: 'lighter',
	children: null,
	size: null,
	floating: false,
	onClear: null,
	onClearMeta: null,
	variant: 'rectangle',
	clearType: 'normal',
	tabIndex: null,
	disabled: false,
	'aria-label': 'Remove',
};

export default memo(RemovableChip);
