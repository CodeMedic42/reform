/* eslint-disable jsx-a11y/anchor-has-content */
import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { ApplyConsumer } from './drop-down-context.js';
import buildId from '../../../common/build-id.js';
import ListItemContent from './list-item-content.js';

interface ListItemLinkProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    onClick?: ((event: React.MouseEvent) => void) | null;
    'aria-label'?: string | null;
    tabIndex?: string | null;
    disabled?: boolean;
    dropDownContext: {
        open: boolean;
    };
    href?: string | null;
}

class ListItemLink extends PureComponent<ListItemLinkProps> {
    private ref: React.RefObject<HTMLAnchorElement>;

    constructor(props: ListItemLinkProps) {
        super(props);

        this.ref = createRef();

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleClick(event: React.MouseEvent): void {
        const { onClick } = this.props;

        if (isNil(onClick)) {
            return;
        }

        onClick(event);
    }

    handleKeyDown(event: React.KeyboardEvent): void {
        // Treat enter key presses as clicks
        if (event.which === 13) {
            this.handleClick(event as unknown as React.MouseEvent);
        }
    }

    getRootNode(): HTMLAnchorElement | null {
        return this.ref.current;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            'aria-label': ariaLabel = null,
            tabIndex = null,
            children = null,
            disabled = false,
            dropDownContext: { open },
            href = null,
        } = this.props;

        const textId = buildId(id, 'text');

        return (
            <>
                <a
                    id={!isNil(id) ? `${id}-button` : null}
                    className={classnames(
                        'ra-dd-list-item-control',
                        'ra-dd-list-item-link',
                        className,
                    )}
                    ref={this.ref}
                    onClick={this.handleClick}
                    onKeyDown={this.handleKeyDown}
                    aria-label={ariaLabel}
                    tabIndex={open ? (tabIndex as unknown as number) : -1}
                    disabled={disabled}
                    href={href}
                    aria-labelledby={textId}
                >
                    {ariaLabel}
                </a>
                <ListItemContent id={textId}>{children}</ListItemContent>
            </>
        );
    }
}

export default ApplyConsumer(ListItemLink);
