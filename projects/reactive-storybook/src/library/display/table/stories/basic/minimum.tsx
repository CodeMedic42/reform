import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';

function Basic() {
    return (
        <Table
            items={items}
            columns={columns}
        />
    );
}

Basic.storyName = 'Minimum';

export default Basic;
