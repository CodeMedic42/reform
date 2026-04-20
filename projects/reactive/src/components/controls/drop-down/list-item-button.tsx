import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { ApplyConsumer } from './drop-down-context.js';
import ListItemContent from './list-item-content.js';

interface ListItemButtonProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    'aria-label'?: string | null;
    tabIndex?: string | null;
    disabled?: boolean;
    onClick?: ((payload: { event: React.MouseEvent }) => void) | null;
    dropDownContext: {
        open: boolean;
    };
}

/**
 * A Button component to be used inside a DropDownListItem component.
 */
class ListItemButton extends PureComponent<ListItemButtonProps> {
    private buttonRef: React.RefObject<HTMLButtonElement>;

    constructor(props: ListItemButtonProps) {
        super(props);

        this.buttonRef = createRef();

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(event: React.KeyboardEvent): void {
        // Treat enter key presses as clicks
        if (event.which === 13) {
            (this as unknown as { handleClick: (event: React.KeyboardEvent) => void }).handleClick(event);
        }
    }

    getRootNode(): HTMLButtonElement | null {
        return this.buttonRef.current;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            'aria-label': ariaLabel = null,
            tabIndex = null,
            children = null,
            disabled = false,
            onClick: _onClick,
            dropDownContext: { open },
        } = this.props;

        return (
            <>
                <button
                    id={!isNil(id) ? `${id}-button` : undefined}
                    className={classnames(
                        'ra-dd-list-item-control',
                        'ra-dd-list-item-button',
                        className,
                    )}
                    ref={this.buttonRef}
                    type="button"
                    onKeyDown={this.handleKeyDown}
                    aria-label={ariaLabel ?? undefined}
                    tabIndex={open ? (tabIndex as unknown as number) : -1}
                    disabled={disabled}
                >
                    {ariaLabel}
                </button>
                <ListItemContent>{children}</ListItemContent>
            </>
        );
    }
}

export default ApplyConsumer(ListItemButton);
