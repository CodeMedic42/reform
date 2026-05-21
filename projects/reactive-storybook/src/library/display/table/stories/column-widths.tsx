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

function renderTable(widths: Array<string | null | undefined> = [], columnWidthsFitContent = false) {
    return (
        <TableBase columnWidthsFitContent={columnWidthsFitContent}>
            <HeadBase>
                <RowBase>
                    <HeaderBase width={widths[0]}>
                        <HeaderCellBase>Col 1 Header</HeaderCellBase>
                    </HeaderBase>
                    <HeaderBase width={widths[1]}>
                        <HeaderCellBase>
                            Col 2 Header with Long Long Name
                        </HeaderCellBase>
                    </HeaderBase>
                    <HeaderBase width={widths[2]}>
                        <HeaderCellBase>Col 3 Header</HeaderCellBase>
                    </HeaderBase>
                    <HeaderBase width={widths[3]}>
                        <HeaderCellBase>Col 3 Header</HeaderCellBase>
                    </HeaderBase>
                </RowBase>
            </HeadBase>
            <BodyBase>
                <RowBase>
                    <CellBase>Row 1 Col 1</CellBase>
                    <CellBase>Row 1 Col 2</CellBase>
                    <CellBase>Row 1 Col 3</CellBase>
                    <CellBase>Row 1 Col 4</CellBase>
                </RowBase>
                <RowBase>
                    <CellBase>Row 2 Col 1</CellBase>
                    <CellBase>
                        Row 2 Col 2 In hac habitasse platea dictumst. Aenean sit
                        amet vehicula lectus. Nullam cursus est vel dui dapibus,
                        id vulputate purus sodales.
                    </CellBase>
                    <CellBase>Row 2 Col 3</CellBase>
                    <CellBase>Row 2 Col 4</CellBase>
                </RowBase>
                <RowBase>
                    <CellBase>Row 3 Col 1 In hac habitasse platea.</CellBase>
                    <CellBase>Row 3 Col 2</CellBase>
                    <CellBase>Row 3 Col 3</CellBase>
                    <CellBase>Row 3 Col 4</CellBase>
                </RowBase>
                <RowBase>
                    <CellBase>Row 4 Col 1 Mauris a erat a odio.</CellBase>
                    <CellBase>Row 4 Col 2 Nam faucibus vulputate lacinia.</CellBase>
                    <CellBase>Row 4 Col 3 Phasellus consequat ante quam.</CellBase>
                    <CellBase>Row 4 Col 4</CellBase>
                </RowBase>
                <RowBase>
                    <CellBase>Row 5 Col 1</CellBase>
                    <CellBase>Row 5 Col 2</CellBase>
                    <CellBase>Row 5 Col 3</CellBase>
                    <CellBase>Row 5 Col 4</CellBase>
                </RowBase>
            </BodyBase>
        </TableBase>
    );
}

function ColumnWidths() {
    return (
        <>
            <Scope title="No Widths">{renderTable()}</Scope>
            <Scope title="Static Widths 240px, 120px, none, 60px">
                {renderTable(['240px', '120px', null, '60px'])}
            </Scope>
            <Scope title="Percentage Widths 50%, 30%, none, 10%">
                {renderTable(['50%', '20%', null, '10%'])}
            </Scope>
            <Scope title="Static and Percentage Widths 25%, 120px, 25%, 120px">
                {renderTable(['25%', '120px', '25%', '120px'])}
            </Scope>
            <Scope title="Column Widths Fit Content">
                {renderTable([], true)}
            </Scope>
            <Scope title="Column Widths Fit Content with Widths 25%, 120px, 25%, 120px">
                {renderTable(['25%', '120px', '25%', '120px'], true)}
            </Scope>
        </>
    );
}

ColumnWidths.storyName = 'Column Widths';

export default ColumnWidths;
