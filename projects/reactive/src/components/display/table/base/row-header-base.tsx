import React from 'react';
import { isEmpty } from 'lodash-es';

interface RowHeaderBaseProps {
    id?: string | null;
    className?: string | null;
    headerText?: React.ReactNode;
    subHeaderText?: React.ReactNode;
}

function RowHeaderBase(props: RowHeaderBaseProps) {
    const {
        id = null,
        className = null,
        headerText = '',
        subHeaderText = '',
    } = props;

    const hasSubHeader = typeof subHeaderText === 'string'
        ? !isEmpty(subHeaderText)
        : subHeaderText != null;

    return (
        <div id={id ?? undefined} className={className ?? undefined}>
            <div className="ra-table-row-header">{headerText}</div>
            {hasSubHeader ? (
                <div className="ra-table-row-sub-header">{subHeaderText}</div>
            ) : null}
        </div>
    );
}

export default RowHeaderBase;
