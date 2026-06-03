import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil, join, map } from 'lodash-es';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import IconBox from '../../display/icon-box/index.js';
import IconButton from '../../display/icon-button/index.js';
import Tag from '../../controls/tag/tag.js';
import Chip from '../../display/chip/index.js';
import applyAnchorBinding from '../../arrangement/drop-down/anchor-binding.js';
import changeSize from '../../../util/change-size.js';
import FieldContainer from '../_support/field-container.js';

interface ClearEvent {
	event: React.MouseEvent;
	data: unknown;
}

interface ClearIndexEvent {
	event: React.MouseEvent;
	data: unknown;
	index: number;
}

interface MultiSelectAnchorProps {
	id?: string | null;
	size?: 'sm' | 'md' | 'lg' | null;
	value?: string[] | null;
	nullable?: boolean;
	onClear?: ((event: ClearEvent) => void) | null;
	onClearIndex?: ((event: ClearIndexEvent) => void) | null;
	eventData?: unknown;
	disabled?: boolean;
	open?: boolean;
	'aria-labelledby'?: string | null;
	'aria-describedby'?: string | null;
	'aria-label'?: string | null;
	title?: string | null;
	placeholder?: string | null;
	expandable?: boolean;
	listBoxId: string;
}

class MultiSelectFieldContainer extends PureComponent<MultiSelectAnchorProps> {
	static defaultProps = {
		id: null,
		size: null,
		nullable: false,
		onClear: null,
		onClearIndex: null,
		eventData: null,
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

	buttonRef: React.RefObject<HTMLButtonElement>;

	constructor(props: MultiSelectAnchorProps) {
		super(props);

		this.buttonRef = createRef<HTMLButtonElement>();

		this.handleClear = this.handleClear.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleClearItem = this.handleClearItem.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);

	}

	handleClear({ event, data }: { event: React.MouseEvent; data: unknown }) {
		const { onClear } = this.props;

		event.preventDefault();

		if (isNil(onClear)) {
			return;
		}

		onClear({
			event,
			data,
		});
	}

	handleMouseDown(event: React.MouseEvent) {
		event.preventDefault();
	}

	handleClearItem({ event, data: index }: { event: React.MouseEvent<HTMLButtonElement>; data: unknown }) {
		const { onClearIndex, eventData } = this.props;

		event.preventDefault();

		if (!isNil(onClearIndex)) {
			this.buttonRef.current?.focus();

			onClearIndex({
				event,
				data: eventData,
				index: index as number,
			});
		}
	}

    handleKeyDown(event: React.KeyboardEvent) {
		const { onClear } = this.props;

        if (
            event.which === 8 // backspace
            || event.which === 46 // delete
        ) {
            if (onClear) {
                onClear({ event: event as unknown as React.MouseEvent, data: null });
            }
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
			disabled || (!nullable && value.length <= 1) ? Chip : Tag;

		return map(value, (text, index) => {
			const itemProps: Record<string, unknown> = {
				color: 'blue',
				onClear: this.handleClearItem,
				eventData: index,
				onMouseDown: this.handleMouseDown,
				size,
				key: text,
				tabIndex: '-1',
				disabled,
				children: text,
			};

			return <ItemComponent {...itemProps as any} key={text}>{text}</ItemComponent>;
		});
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
			eventData,
			expandable,
			listBoxId,
		} = this.props;

		const clearButton =
			nullable && !isNil(value) && value.length > 0 ? (
				<IconButton
					className="clear"
					tabIndex="-1"
					icon={faXmark}
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => this.handleClear({ event, data: eventData })}
					size={changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
					disabled={disabled}
				/>
			) : null;

		return (
			<FieldContainer
				className={classnames(
					'ra-select-field-container',
					'ra-multi-select-field-container',
					`size-${size}`, {
						focus: open,
					}
				)}
			>
				<div
					className={classnames('ra-anchor-boundary', {
						expandable,
					})}
				>
					<button
						id={id ?? undefined}
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
						aria-describedby={describedBy ?? undefined}
						aria-labelledby={labelledBy ?? undefined}
						aria-label={ariaLabel ?? undefined}
						title={title ?? undefined}
						disabled={disabled}
						value={
							!isNil(value) && value.length > 0
								? join(value, ' ')
								: undefined
						}
						onKeyDown={this.handleKeyDown}
					/>
					<div
						className="anchor-content"
						role="presentation"
						onMouseDown={this.handleMouseDown}
					>
						<div className="anchor-selected-items">
							{this.renderChips()}
						</div>
						<IconBox
							className="arrow"
							icon={open ? faAngleUp : faAngleDown}
							size={changeSize(size ?? 'md', 1) as '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'}
						/>
						{clearButton}
					</div>
				</div>
			</FieldContainer>
		);
	}
}

export default applyAnchorBinding(MultiSelectFieldContainer, {
	focusSelector: '.button-anchor',
	// boundingSelector: '.ra-anchor-boundary',
});
