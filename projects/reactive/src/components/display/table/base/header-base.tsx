import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import HeaderCellBase from './header-cell-base.js';

type StickyHeaderStyle = React.CSSProperties & {
    '--sticky-table-left-offset'?: string | null;
};

interface HeaderBaseProps {
    id?: string | null;
    className?: string | null;
    width?: string | null;
    left?: string | null;
    sortDirection?: 'none' | 'ascending' | 'descending' | null;
    colSpan?: number;
    children?: React.ReactNode;
    lastColumn?: boolean;
}

class HeaderBase extends PureComponent<HeaderBaseProps> {
    render() {
        const {
            id = null,
            className = null,
            width = null,
            left = null,
            sortDirection = null,
            colSpan,
            children = null,
            lastColumn = false,
        } = this.props;

        const content = !isNil(children) ? children : <HeaderCellBase />;

        const leftOffset = !isNil(left)
            ? `calc(var(--sticky-left-offset, 0px) + ${left})`
            : null;

        // Note the use of the CSS variable --sticky-table-left-offset.
        // It dynamically sets the necessary offset of a sticky column.
        const style: StickyHeaderStyle = {
            width: width ?? undefined,
            '--sticky-table-left-offset': leftOffset,
        };

        return (
            <th
                id={id ?? undefined}
                className={classnames('ra-header', className, {
                    'sticky-column': !isNil(left),
                    'last-column': lastColumn,
                })}
                style={style}
                aria-sort={sortDirection ?? undefined}
                colSpan={colSpan}
            >
                {content}
            </th>
        );
    }
}

export default HeaderBase;
