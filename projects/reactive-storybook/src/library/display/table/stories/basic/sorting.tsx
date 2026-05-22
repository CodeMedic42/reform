import React, { useMemo, useState } from 'react';
import { get, isArray, orderBy } from 'lodash-es';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';

type SortPath = string | string[];

function sortItems(
    rows: typeof items,
    sortPath: SortPath | null,
    sortDescending: boolean,
) {
    if (!sortPath) {
        return rows;
    }

    return orderBy(
        rows,
        (row) => {
            const paths = isArray(sortPath) ? sortPath : [sortPath];
            return paths.map((p) => {
                const value = get(row, p, '');
                return typeof value === 'string' ? value.toLowerCase() : value;
            });
        },
        sortDescending ? 'desc' : 'asc',
    );
}

function describeSort(sortPath: SortPath | null, sortDescending: boolean): string {
    if (!sortPath) {
        return 'unsorted';
    }
    const label = isArray(sortPath) ? sortPath.join(', ') : sortPath;
    return `${label} (${sortDescending ? 'descending' : 'ascending'})`;
}

function Sorting() {
    const [sortPath, setSortPath] = useState<SortPath | null>(null);
    const [sortDescending, setSortDescending] = useState(false);

    const sortedItems = useMemo(
        () => sortItems(items, sortPath, sortDescending),
        [sortPath, sortDescending],
    );

    return (
        <>
            <div style={{ marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>
                Sort: {describeSort(sortPath, sortDescending)}
            </div>
            <Table
                items={sortedItems}
                columns={columns}
                minWidth={1100}
                sortPath={sortPath}
                sortDescending={sortDescending}
                onSortChange={(path, descending) => {
                    setSortPath(path);
                    setSortDescending(descending);
                }}
            />
        </>
    );
}

Sorting.storyName = 'Sorting';

export default Sorting;
