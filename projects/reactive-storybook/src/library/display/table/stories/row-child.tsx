import React, { useState } from 'react';
import { omit, take } from 'lodash-es';
import { Text } from '@reformjs/reactive/display/typography';
import Table, { CellBase } from '@reformjs/reactive/display/table';
import { items, columns } from './constants';
import Scope from './_scope';

const initialColumns = take(columns, 3);

function renderText(value: React.ReactNode, weight?: 'bold') {
    return (
        <div style={{ paddingBottom: '15px' }}>
            <Text weight={weight ?? null}>{value}</Text>
        </div>
    );
}

function RowChild() {
    const [openedRows, setOpenedRows] = useState<Record<string, true>>({});

    const toggleOpenRow = ({ meta }: { meta: unknown }) => {
        const id = (meta as { item?: { id?: string } } | undefined)?.item?.id;
        if (!id) return;

        if (openedRows[id]) {
            setOpenedRows(omit(openedRows, id) as Record<string, true>);
        } else {
            setOpenedRows({
                ...openedRows,
                [id]: true,
            });
        }
    };

    return (
        <Scope title="Row Child">
            {renderText('Click a row to toggle visibility of its row child')}
            <Table
                items={items}
                columns={initialColumns}
                minWidth={1100}
                initialSortPath="dob"
                initialSortDescending
                onClickRow={toggleOpenRow}
                renderRowChild={(item) => {
                    const id = item.id as string;
                    if (!openedRows[id]) {
                        return null;
                    }

                    const { gender, fullAddress, homePhone, status } =
                        item as Record<string, string>;

                    return (
                        <>
                            <CellBase colSpan={1}>
                                {renderText('Gender', 'bold')}
                                {renderText('Address', 'bold')}
                                {renderText('Phone', 'bold')}
                                {renderText('Status', 'bold')}
                            </CellBase>
                            <CellBase colSpan={2}>
                                {renderText(gender)}
                                {renderText(fullAddress)}
                                {renderText(homePhone)}
                                {renderText(status)}
                            </CellBase>
                        </>
                    );
                }}
            />
        </Scope>
    );
}

RowChild.storyName = 'Row Child';

export default RowChild;
