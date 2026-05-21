import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from './constants';
import Scope from './_scope';

function renderTable(maxWidth: string, maxHeight: number | null) {
    return (
        <div
            style={{
                maxWidth,
            }}
        >
            <p>
                For self contained tables, headers stick to the table container
                and not to the viewport top
            </p>
            <Table
                items={items}
                columns={columns}
                stickyColumns={2}
                minWidth={1200}
                maxHeight={maxHeight}
            />
        </div>
    );
}

function SelfContained() {
    return (
        <>
            <Scope title="Self Contained">{renderTable('800px', null)}</Scope>
            <Scope title="Self Contained with Max Height">
                {renderTable('90%', 240)}
            </Scope>
        </>
    );
}

SelfContained.storyName = 'Self Contained';

export default SelfContained;
