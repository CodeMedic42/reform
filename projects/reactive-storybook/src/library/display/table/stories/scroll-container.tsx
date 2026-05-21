import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from './constants';
import Scope from './_scope';

function renderTable(containerId: string, pageTable: boolean, description: string) {
    return (
        <div
            id={containerId}
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
                {description}
            </p>
            <Table
                items={items}
                columns={columns}
                pageTable={pageTable}
                stickyColumns={2}
                minWidth={1400}
                initialSortPath="dob"
                initialSortDescending
                useParentScroll
            />
        </div>
    );
}

function ScrollContainer() {
    return (
        <>
            <Scope title="Using parent scrolling with 2 Sticky Columns">
                {renderTable(
                    'scroll-container-1',
                    false,
                    "Normally the table handles it's own scrolling. However sometimes to we want to use the page or another parent to scroll. This example show how to do that.",
                )}
            </Scope>
            <Scope title="Using parent scrolling and page table with 2 Sticky Columns">
                {renderTable(
                    'scroll-container-2',
                    true,
                    'This is exactly the same as the one above but the pageTable prop is turned on. This adds the standard page gutter to the left and right side of the table. This should only be used with a table which is rendered at the root of the page.',
                )}
            </Scope>
        </>
    );
}

ScrollContainer.storyName = 'Scroll Container';

export default ScrollContainer;
