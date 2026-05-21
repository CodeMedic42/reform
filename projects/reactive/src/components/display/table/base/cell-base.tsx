import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';

type StickyCellStyle = React.CSSProperties & {
    '--sticky-table-left-offset'?: string | null;
};

interface CellBaseProps {
    className?: string | null;
    left?: string | null;
    colSpan?: number;
    rowSpan?: number;
    children?: React.ReactNode;
    lastColumn?: boolean;
}

class CellBase extends PureComponent<CellBaseProps> {
    render() {
        const {
            children = null,
            colSpan,
            rowSpan,
            left = null,
            className = null,
            lastColumn = false,
        } = this.props;

        const leftOffset = !isNil(left)
            ? `calc(var(--sticky-left-offset, 0px) + ${left})`
            : null;

        // Note the use of the CSS variable --sticky-table-left-offset.
        // It dynamically sets the necessary offset of a sticky column.
        const style: StickyCellStyle = {
            '--sticky-table-left-offset': leftOffset,
        };

        return (
            <td
                className={classnames('ra-cell', className, {
                    'sticky-column': !isNil(left),
                    'last-column': lastColumn,
                })}
                style={style}
                colSpan={colSpan}
                rowSpan={rowSpan}
            >
                {children}
            </td>
        );
    }
}

export default CellBase;
