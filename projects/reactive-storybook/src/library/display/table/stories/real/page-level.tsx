import React, { useState } from 'react';
import Table from '@reformjs/reactive/display/table';
import { items, columns } from '../constants';
import Page, { PageContent } from '@reformjs/reactive/arrangement/page';
import StaticContainer from '@reformjs/reactive/arrangement/static-container';
import Card from '@reformjs/reactive/arrangement/card';

type TableItem = Record<string, unknown>;

function Basic() {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const isRowSelected = (item: TableItem) =>
        selected.has(item.id as string);

    const isHeaderSelected = (
        allItems: TableItem[] | Record<string, TableItem> | null | undefined,
    ) => {
        const arr = Array.isArray(allItems)
            ? allItems
            : allItems
                ? Object.values(allItems)
                : [];
        return arr.length > 0 && selected.size === arr.length;
    };

    const onRowSelect = (item: TableItem, checked: boolean) => {
        const id = item.id as string;
        const next = new Set(selected);
        if (checked) {
            next.add(id);
        } else {
            next.delete(id);
        }
        setSelected(next);
    };

    const onHeaderSelect = (allItems: TableItem[], checked: boolean) => {
        setSelected(
            new Set(checked ? allItems.map((i) => i.id as string) : []),
        );
    };

    return (
        <Page>
            <PageContent>
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: 'red',
                        height: '20px',
                        // zIndex: 1,
                        width: '100px'
                    }}
                />
                <StaticContainer>
                    <p
                        style={{
                            position: 'sticky',
                            left: '0',
                        }}
                    >
                        Normally the table handles it's own scrolling. However sometimes to we want to use the page or another parent to scroll. This example show how to do that.
                    </p>
                </StaticContainer>
                <Card>
                    <StaticContainer>
                        <p
                            style={{
                                position: 'sticky',
                                left: '0',
                            }}
                        >
                            Normally the table handles it's own scrolling. However sometimes to we want to use the page or another parent to scroll. This example show how to do that.
                        </p>
                    </StaticContainer>
                    <Table
                        items={items}
                        columns={columns}
                        pageTable={false}
                        stickyColumns={3}
                        minWidth={1400}
                        initialSortPath="dob"
                        initialSortDescending
                        useParentScroll
                        selectable
                        headerSelectable
                        isRowSelected={isRowSelected}
                        isHeaderSelected={isHeaderSelected}
                        onRowSelect={onRowSelect}
                        onHeaderSelect={onHeaderSelect}
                    />
                </Card>
            </PageContent>
        </Page>
    );
}

Basic.storyName = 'Real Page Level';

export default Basic;
