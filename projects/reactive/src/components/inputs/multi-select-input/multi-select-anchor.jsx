/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import join from 'lodash/join';
import map from 'lodash/map';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import IconBox from '../../display/icon-box';
import IconButton from '../../display/icon-button';
import RemovableChip from '../../display/chip/removable-chip';
import Chip from '../../display/chip';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding';
import changeSize from '../../../util/change-size';

class MultiSelectAnchor extends PureComponent {
	static propTypes = {
		id: PropTypes.string,
		size: PropTypes.oneOf(['sm', 'md', 'lg']),
		value: PropTypes.arrayOf(PropTypes.string),
		nullable: PropTypes.bool,
		onClear: PropTypes.func,
		// eslint-disable-next-line react/forbid-prop-types
		onClearMeta: PropTypes.object,
		onClearIndex: PropTypes.func,
		// eslint-disable-next-line react/forbid-prop-types
		onClearIndexMeta: PropTypes.object,
		disabled: PropTypes.bool,
		open: PropTypes.bool,
		'aria-labelledby': PropTypes.string,
		'aria-describedby': PropTypes.string,
		'aria-label': PropTypes.string,
		title: PropTypes.string,
		placeholder: PropTypes.string,
		expandable: PropTypes.bool,
		listBoxId: PropTypes.string.isRequired,
	};

	static defaultProps = {
		id: null,
		size: null,
		nullable: false,
		onClear: null,
		onClearMeta: null,
		onClearIndex: null,
		onClearIndexMeta: null,
		disabled: false,
		open: false,
		title: null,
		'aria-labelledby': null,
		'aria-describedby': null,
		'aria-label': null,
		placeholder: null,
		value: null,
		expandable: false,
	};

	constructor(props) {
		super(props);

		this.buttonRef = createRef();

		this.handleClear = this.handleClear.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleClearItem = this.handleClearItem.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);

	}

	handleClear({ event, meta }) {
		const { onClear } = this.props;

		event.preventDefault();

		if (isNil(onClear)) {
			return;
		}

		onClear({
			event,
			meta,
		});
	}

	// eslint-disable-next-line class-methods-use-this
	handleMouseDown(event) {
		event.preventDefault();
	}

	handleClearItem({ event, meta: index }) {
		const { onClearIndex, onClearIndexMeta } = this.props;

		event.preventDefault();

		if (!isNil(onClearIndex)) {
			this.buttonRef.current.focus();

			onClearIndex({
				event,
				meta: onClearIndexMeta,
				index,
			});
		}
	}

    handleKeyDown(event) {
		const { onClear } = this.props;

        if (
            event.which === 8 // backspace
            || event.which === 46 // delete
        ) {
            onClear();
        };
    };

	renderChips() {
		const { placeholder, value, size, nullable, disabled } = this.props;

		if (isNil(value) || value.length <= 0) {
			if (isNil(placeholder) || placeholder.length <= 0) {
				return '';
			}

			return <div className="placeholder">{placeholder}</div>;
		}

		const ItemComponent =
			disabled || (!nullable && value.length <= 1) ? Chip : RemovableChip;

		return map(value, (text, index) => (
			<ItemComponent
				color="blue"
				onClear={this.handleClearItem}
				onClearMeta={index}
				onMouseDown={this.handleMouseDown}
				size={size}
				key={text}
				tabIndex="-1"
				disabled={disabled}
			>
				{text}
			</ItemComponent>
		));
	}

	render() {
		const {
			id,
			disabled,
			'aria-labelledby': labelledBy,
			'aria-describedby': describedBy,
			'aria-label': ariaLabel,
			title,
			open,
			nullable,
			size,
			value,
			onClearMeta,
			expandable,
			listBoxId,
		} = this.props;

		const clearButton =
			nullable && !isNil(value) && value.length > 0 ? (
				<IconButton
					className="clear"
					tabIndex="-1"
					icon={faXmark}
					onClick={this.handleClear}
					onClearMeta={onClearMeta}
					size={changeSize(size, 1)}
					disabled={disabled}
				/>
			) : null;

		return (
			<div
				className={classnames(
					'select-anchor',
					'multi-select-anchor',
					`size-${size}`,
				)}
			>
				<div
					className={classnames('anchor-boundary', {
						expandable,
						focus: open,
					})}
				>
					<button
						id={id}
						ref={this.buttonRef}
						className={classnames(
							'anchor-control',
							'button-anchor',
							{
								nullable,
								focus: open,
								'has-value': !isNil(value) && value.length > 0,
							},
						)}
						role="combobox"
						aria-controls={listBoxId}
						aria-expanded={open}
						aria-haspopup="listbox"
						type="button"
						aria-describedby={describedBy}
						aria-labelledby={labelledBy}
						aria-label={ariaLabel}
						title={title}
						disabled={disabled}
						value={
							!isNil(value) && value.length > 0
								? join(value, ' ')
								: null
						}
						onKeyDown={this.handleKeyDown}
					/>
					<div
						className="anchor-content"
						onMouseDown={this.handleMouseDown}
					>
						<div className="anchor-selected-items">
							{this.renderChips()}
						</div>
						<IconBox
							className="arrow"
							icon={open ? faAngleUp : faAngleDown}
							size={changeSize(size, 1)}
						/>
						{clearButton}
					</div>
				</div>
			</div>
		);
	}
}

export default applyAnchorBinding(MultiSelectAnchor, {
	focusSelector: '.button-anchor',
	boundingSelector: '.anchor-boundary',
});
