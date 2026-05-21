import React from 'react';
import {
    TableBase,
    HeadBase,
    HeaderBase,
    BodyBase,
    RowBase,
    CellBase,
    HeaderCellBase,
} from '@reformjs/reactive/display/table';
import Scope from './_scope';

function renderTable(maxHeight: number | null, stickyColumns: number) {
    const secondColumnLeft = stickyColumns > 1 ? '150px' : null;

    return (
        <>
            <p>Top Content</p>
            <div style={{ display: 'flex' }}>
                <span style={{ paddingRight: '10px' }}>Side Content</span>
                <span>
                    <TableBase
                        minWidth={1200}
                        maxHeight={maxHeight}
                        stickyColumns={stickyColumns}
                    >
                        <HeadBase>
                            <RowBase>
                                <HeaderBase width="150px">
                                    <HeaderCellBase>Col 1 Header</HeaderCellBase>
                                </HeaderBase>
                                <HeaderBase left={secondColumnLeft}>
                                    <HeaderCellBase>Col 2 Header</HeaderCellBase>
                                </HeaderBase>
                                <HeaderBase>
                                    <HeaderCellBase>Col 3 Header</HeaderCellBase>
                                </HeaderBase>
                                <HeaderBase>
                                    <HeaderCellBase>Col 4 Header</HeaderCellBase>
                                </HeaderBase>
                                <HeaderBase>
                                    <HeaderCellBase>Col 5 Header</HeaderCellBase>
                                </HeaderBase>
                                <HeaderBase>
                                    <HeaderCellBase>Col 6 Header</HeaderCellBase>
                                </HeaderBase>
                            </RowBase>
                        </HeadBase>
                        <BodyBase>
                            <RowBase>
                                <CellBase>Row 1 Col 1</CellBase>
                                <CellBase left={secondColumnLeft}>Row 1 Col 2</CellBase>
                                <CellBase>Row 1 Col 3</CellBase>
                                <CellBase>Row 1 Col 4</CellBase>
                                <CellBase>Row 1 Col 5</CellBase>
                                <CellBase>Row 1 Col 6</CellBase>
                            </RowBase>
                            <RowBase>
                                <CellBase>Row 2 Col 1</CellBase>
                                <CellBase left={secondColumnLeft}>
                                    Row 2 Col 2 In hac habitasse platea
                                    dictumst. Aenean sit amet vehicula lectus.
                                    Nullam cursus est vel dui dapibus, id
                                    vulputate purus sodales.
                                </CellBase>
                                <CellBase>Row 2 Col 3</CellBase>
                                <CellBase>Row 2 Col 4</CellBase>
                                <CellBase>Row 2 Col 5</CellBase>
                                <CellBase>Row 2 Col 6</CellBase>
                            </RowBase>
                            <RowBase>
                                <CellBase>Row 3 Col 1 In hac habitasse platea.</CellBase>
                                <CellBase left={secondColumnLeft}>Row 3 Col 2</CellBase>
                                <CellBase>Row 3 Col 3</CellBase>
                                <CellBase>Row 3 Col 4</CellBase>
                                <CellBase>Row 3 Col 5</CellBase>
                                <CellBase>Row 3 Col 6</CellBase>
                            </RowBase>
                            <RowBase>
                                <CellBase>Row 4 Col 1 Mauris a erat a odio.</CellBase>
                                <CellBase left={secondColumnLeft}>
                                    Row 4 Col 2 Nam faucibus vulputate lacinia.
                                </CellBase>
                                <CellBase>
                                    Row 4 Col 3 Phasellus consequat ante quam.
                                </CellBase>
                                <CellBase>Row 4 Col 4</CellBase>
                                <CellBase>Row 5 Col 5</CellBase>
                                <CellBase>Row 5 Col 6</CellBase>
                            </RowBase>
                            <RowBase>
                                <CellBase>Row 5 Col 1</CellBase>
                                <CellBase left={secondColumnLeft}>Row 5 Col 2</CellBase>
                                <CellBase>Row 5 Col 3</CellBase>
                                <CellBase>Row 5 Col 4</CellBase>
                                <CellBase>Row 5 Col 5</CellBase>
                                <CellBase>Row 5 Col 6</CellBase>
                            </RowBase>
                        </BodyBase>
                    </TableBase>
                </span>
            </div>
        </>
    );
}

function Sticky() {
    return (
        <>
            <Scope
                title="Sticky Columns"
                specimenViewStyle={{ maxHeight: '360px' }}
            >
                {renderTable(null, 2)}
            </Scope>
            <Scope title="Max Height">{renderTable(220, 0)}</Scope>
            <Scope title="Sticky Column with Max Height">
                {renderTable(220, 1)}
            </Scope>
        </>
    );
}

Sticky.storyName = 'Sticky';

export default Sticky;
