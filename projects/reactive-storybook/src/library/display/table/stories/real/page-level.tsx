import React from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';
import Page, { PageContainer } from '@reformjs/reactive/arrangement/page';
import Card from '@reformjs/reactive/arrangement/card';

function Basic() {
    return (
        <Page>
            <PageContainer>
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
                <Card>
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
                </Card>
            </PageContainer>
        </Page> 
    );
}

Basic.storyName = 'Real Page Level';

export default Basic;
