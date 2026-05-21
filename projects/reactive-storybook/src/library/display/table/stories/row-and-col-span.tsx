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

function RowAndColSpan() {
    return (
        <>
            <Scope title="Col Span" minWidth={1000}>
                <TableBase>
                    <HeadBase>
                        <RowBase>
                            <HeaderBase colSpan={3}>
                                <HeaderCellBase>Col 1, 2 and 3 Header</HeaderCellBase>
                            </HeaderBase>
                        </RowBase>
                        <RowBase>
                            <HeaderBase>
                                <HeaderCellBase>Col 1 Header</HeaderCellBase>
                            </HeaderBase>
                            <HeaderBase colSpan={2}>
                                <HeaderCellBase>Col 2 and 3 Header</HeaderCellBase>
                            </HeaderBase>
                        </RowBase>
                    </HeadBase>
                    <BodyBase>
                        <RowBase>
                            <CellBase>Row 1 Col 1</CellBase>
                            <CellBase>Row 1 Col 2</CellBase>
                            <CellBase>Row 1 Col 3</CellBase>
                        </RowBase>
                        <RowBase>
                            <CellBase>Row 2 Col 1</CellBase>
                            <CellBase colSpan={2}>
                                Row 2 Col 2 and 3 In hac habitasse platea
                                dictumst. Aenean sit amet vehicula lectus.
                                Nullam cursus est vel dui dapibus, id vulputate
                                purus sodales.
                            </CellBase>
                        </RowBase>
                        <RowBase>
                            <CellBase colSpan={3}>Row 3 Col 1, 2 and 3</CellBase>
                        </RowBase>
                    </BodyBase>
                </TableBase>
            </Scope>
            <Scope title="Row Span">
                <TableBase>
                    <HeadBase>
                        <RowBase>
                            <HeaderBase />
                            <HeaderBase>
                                <HeaderCellBase>Patient Name</HeaderCellBase>
                            </HeaderBase>
                            <HeaderBase>
                                <HeaderCellBase>DOB</HeaderCellBase>
                            </HeaderBase>
                        </RowBase>
                    </HeadBase>
                    <BodyBase>
                        <RowBase>
                            <CellBase rowSpan={2}>Checked In</CellBase>
                            <CellBase>Denise Franklin</CellBase>
                            <CellBase>03/21/1976</CellBase>
                        </RowBase>
                        <RowBase className="nested-row">
                            <CellBase>Frances Phillips</CellBase>
                            <CellBase>02/15/1944</CellBase>
                        </RowBase>
                        <RowBase>
                            <CellBase rowSpan={2}>Checked Out</CellBase>
                            <CellBase>Brok De Haven</CellBase>
                            <CellBase>12/09/1908</CellBase>
                        </RowBase>
                        <RowBase className="nested-row">
                            <CellBase>Frederico Lockhurst</CellBase>
                            <CellBase />
                        </RowBase>
                    </BodyBase>
                </TableBase>
            </Scope>
        </>
    );
}

RowAndColSpan.storyName = 'Row and Col Span';

export default RowAndColSpan;
