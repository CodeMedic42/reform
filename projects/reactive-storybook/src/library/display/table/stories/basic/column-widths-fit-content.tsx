import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';

function Basic() {
    return (
        <Table
            items={items}
            columns={columns}
            minWidth={800}
        />
    );
}

Basic.storyName = 'Column Widths Fit Content';

export default Basic;
