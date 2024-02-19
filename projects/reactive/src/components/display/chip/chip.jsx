import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import {
	colorPropType,
	getColorInfo,
	shadePropType,
} from '../../../common/color-list';
import { getDefaultSize } from './utils';

class Chip extends PureComponent {
	static propTypes = {
		id: PropTypes.string,
		className: PropTypes.string,
		color: colorPropType,
		shade: shadePropType,
		size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
		disabled: PropTypes.bool,
		floating: PropTypes.bool,
		children: PropTypes.oneOfType([
			PropTypes.node,
			PropTypes.arrayOf(PropTypes.node),
		]),
		variant: PropTypes.oneOf(['rectangle', 'pill']),
		onClick: PropTypes.func,
		// eslint-disable-next-line react/forbid-prop-types
		onClickMeta: PropTypes.any,
		asButton: PropTypes.bool,
	};

	static defaultProps = {
		id: null,
		className: null,
		shade: 'lighter',
		children: null,
		size: 'md',
		floating: false,
		variant: 'rectangle',
		onClick: null,
		onClickMeta: null,
		disabled: false,
		asButton: false,
		color: null,
	};

	constructor(props) {
		super(props);

		this.buttonRef = React.createRef();

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		const { onClick, onClickMeta } = this.props;

		if (isNil(onClick)) {
			return;
		}

		onClick({ event, meta: onClickMeta });
	}

	focus() {
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

	render() {
		const {
			id,
			className,
			children,
			color,
			shade,
			size,
			floating,
			variant,
			onClick,
			disabled,
			asButton,
		} = this.props;

		const { colorClasses } = getColorInfo({
			color,
			shade,
			style: 'fill',
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
					id={id}
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
			<span id={id} className={finalClassName}>
				{children}
			</span>
		);
	}
}

export default Chip;
