import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';
import Page from '@reformjs/reactive/arrangement/page';
import StickyContainer from '@reformjs/reactive/arrangement/sticky-container';

function Basic() {
    return (
        <div
            id="scroll-container-1"
            style={{
                height: '260px',
                overflow: 'auto',
            }}
        >
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'red',
                    height: '20px',
                    zIndex: 1,
                }}
            />
            <p
                style={{
                    position: 'sticky',
                    left: '0',
                }}
            >
                Normally the table handles it's own scrolling. However sometimes to we want to use the page or another parent to scroll. This example show how to do that.
            </p>
            <Table
                items={items}
                columns={columns}
                pageTable={false}
                stickyColumns={2}
                minWidth={1400}
                initialSortPath="dob"
                initialSortDescending
                useParentScroll
            />
        </div>
    );
}

Basic.storyName = 'Sticky First Column';

export default Basic;
