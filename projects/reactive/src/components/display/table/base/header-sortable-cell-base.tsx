import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

export interface HeaderSortableClickEvent {
    event: React.MouseEvent<HTMLButtonElement>;
    data: unknown;
}

interface HeaderSortableCellBaseProps {
    id?: string | null;
    children?: React.ReactNode;
    sortDirection?: 'none' | 'ascending' | 'descending' | null;
    headerText?: string | null;
    onClick?: ((event: HeaderSortableClickEvent) => void) | null;
    eventData?: unknown;
}

class HeaderSortableCellBase extends PureComponent<HeaderSortableCellBaseProps> {
    constructor(props: HeaderSortableCellBaseProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        const { onClick, eventData } = this.props;

        event.preventDefault();

        if (isNil(onClick)) {
            return;
        }

        onClick({
            data: eventData,
            event,
        });
    }

    render() {
        const {
            id = null,
            sortDirection = null,
            headerText = null,
            children = null,
        } = this.props;

        if (isNil(children)) {
            return null;
        }

        let title = headerText;
        let sortClass: string | null = null;

        if (!isNil(sortDirection)) {
            if (sortDirection === 'none') {
                title = `Sort ${headerText}`;
            } else if (sortDirection === 'ascending') {
                title = `${headerText} Sorted Ascending`;

                sortClass = 'sort-asc';
            } else if (sortDirection === 'descending') {
                title = `${headerText} Sorted Descending`;

                sortClass = 'sort-dec';
            }
        }

        return (
            <button
                type="button"
                id={id ? `${id}-button` : undefined}
                className={classnames(
                    'ra-header-cell',
                    'ra-header-sortable',
                    'no-select',
                    sortClass,
                )}
                title={title ?? undefined}
                onClick={this.handleClick}
            >
                {children}
                <span className="ra-sort-icon" />
            </button>
        );
    }
}

export default HeaderSortableCellBase;
