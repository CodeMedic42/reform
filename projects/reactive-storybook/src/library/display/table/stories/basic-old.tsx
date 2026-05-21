import React, { useState } from 'react';
import { cloneDeep, isArray } from 'lodash-es';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from './constants';
import Scope from './_scope';

function renderTable(columnWidthsFitContent = false) {
    return (
        <Table
            items={items}
            columns={columns}
            columnWidthsFitContent={columnWidthsFitContent}
            minWidth={1100}
            initialSortPath="dob"
            initialSortDescending
        />
    );
}

function Basic() {
    const [sortPath, setSortPath] = useState<string>('no path');
    const [sortDescending, setSortDescending] = useState<string>('');

    return (
        <>
            <Scope title="Simple Table Basic">{renderTable()}</Scope>
            <Scope title="Simple Table Column Widths Fit Content">
                {renderTable(true)}
            </Scope>
            <Scope title="onSortChange">
                <div style={{ marginBottom: '8px' }}>
                    {sortPath}
                    {sortDescending}
                </div>
                <Table
                    items={items}
                    columns={columns}
                    minWidth={1100}
                    initialSortPath="dob"
                    initialSortDescending
                    onSortChange={(path, isDescending) => {
                        let fullPath: string | string[] | null = cloneDeep(path);
                        if (isArray(fullPath)) {
                            fullPath = fullPath.join(', ');
                        }
                        setSortPath((fullPath as string) || 'no path');
                        setSortDescending(
                            isDescending ? ' descending' : ' ascending',
                        );
                    }}
                />
            </Scope>
        </>
    );
}

Basic.storyName = 'Basic';

export default Basic;
