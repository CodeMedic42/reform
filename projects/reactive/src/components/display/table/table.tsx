import React, { Fragment } from 'react';
import classnames from 'classnames';
import {
    get,
    map,
    isString,
    isNil,
    noop,
    isEqual,
    forEach,
    join,
    isArray,
    isBoolean,
    reduce,
} from 'lodash-es';
import TableBase from './base/table-base.js';
import HeadBase from './base/head-base.js';
import HeaderBase from './base/header-base.js';
import BodyBase from './base/body-base.js';
import RowBase from './base/row-base.js';
import CellBase from './base/cell-base.js';
import HeaderCellBase from './base/header-cell-base.js';
import HeaderSortableCellBase from './base/header-sortable-cell-base.js';
import CheckInputField from '../../fields/check-input-field/check-input-field.js';

type SortPath = string | string[];

type TableItem = Record<string, unknown>;

interface RowSelectionState {
    selected: boolean;
    disabled: boolean;
}

export interface SimpleTableColumn {
    headerBody?: React.ReactNode;
    headerClass?: string | null;
    cellValuePath?: SortPath;
    width?: string;
    cellSortPath?: SortPath;
    sortable?: boolean;
    bold?: boolean;
    renderCell?: (
        cellValue: unknown,
        item: TableItem,
        rowIndex: number,
        selectionState: RowSelectionState,
    ) => React.ReactNode;
    left?: string;
    lastColumn?: boolean;
}

export interface RowClickMeta {
    item: TableItem;
    rowIndex: number;
}

/** Row click event. `data` is typed as `unknown` to match RowBase; in practice
 * this Table always provides `{ item, rowIndex }` (see {@link RowClickMeta}). */
interface RowClickEvent {
    event: React.MouseEvent<HTMLTableRowElement>;
    data: unknown;
}

/** Sortable-header click event. `data` is typed as `unknown` to match
 *  HeaderSortableCellBase; this Table always sets `eventData` to the column's
 *  sort path, so handleSort narrows it to {@link SortPath}. */
interface SortClickEvent {
    event: React.MouseEvent<HTMLButtonElement>;
    data: unknown;
}

export interface SimpleTableProps {
    id?: string | null;
    className?: string | null;
    items?: TableItem[] | Record<string, TableItem> | null;
    columns: SimpleTableColumn[];
    alwaysShowHeaders?: boolean;
    minWidth?: number | null;
    maxHeight?: number | null;
    pageTable?: boolean;
    sortPath?: SortPath | null;
    sortDescending?: boolean;
    paddingSize?: 'sm' | 'md' | 'lg';
    stickyColumns?: number;
    columnWidthsFitContent?: boolean;
    headerSelectable?: boolean;
    selectable?: boolean;
    isHeaderSelected?: (items: SimpleTableProps['items']) => boolean;
    isRowSelected?: (
        item: TableItem,
        rowIndex: number,
    ) => boolean | RowSelectionState | null | undefined;
    onHeaderSelect?: (items: TableItem[], checked: boolean) => void;
    onRowSelect?: (item: TableItem, checked: boolean, rowIndex: number) => void;
    renderRowChild?: ((item: TableItem, rowIndex: number) => React.ReactNode) | null;
    onClickRow?: ((event: RowClickEvent) => void) | null;
    useParentScroll?: boolean;
    onSortChange?: ((sortPath: SortPath | null, sortDescending: boolean) => void) | null;
}

function isSortPathsEqual(first: SortPath | null, second: SortPath | null) {
    const firstCompare = isArray(first) ? first : [first];
    const secondCompare = isArray(second) ? second : [second];

    return isEqual(firstCompare, secondCompare);
}

/**
 * Returns a string from the value in the item at valuePath.
 * If valuePath is an array it returns each value at each path
 * concatenated together into a string separated by spaces.
 */
function getValueFromPath(item: TableItem, valuePath: SortPath | undefined): string {
    if (isNil(valuePath)) {
        return '';
    }

    if (isArray(valuePath)) {
        return join(
            map(valuePath, (path) => get(item, path, '') as string),
            ' ',
        );
    }

    return get(item, valuePath, '') as string;
}

export default function Table({
    id = null,
    className = '',
    items = null,
    columns,
    alwaysShowHeaders = false,
    minWidth = null,
    maxHeight = null,
    pageTable = false,
    stickyColumns = 0,
    columnWidthsFitContent = false,
    headerSelectable = false,
    selectable = false,
    isHeaderSelected,
    isRowSelected,
    onHeaderSelect = noop,
    onRowSelect = noop,
    renderRowChild = null,
    onClickRow = null,
    useParentScroll = false,
    sortPath = null,
    sortDescending = false,
    onSortChange = null,
}: SimpleTableProps): React.ReactElement | null {
    let baseItems: TableItem[] = [];
    if (isArray(items)) {
        baseItems = items;
    } else if (!isNil(items)) {
        baseItems = Object.values(items);
    }

    if (baseItems.length === 0 && !alwaysShowHeaders) {
        return null;
    }

    const handleSort = ({ data }: SortClickEvent) => {
        const clicked = data as SortPath | null;
        let nextSortPath: SortPath | null = clicked;
        let nextSortDescending = false;

        if (isSortPathsEqual(clicked, sortPath)) {
            if (sortDescending) {
                nextSortPath = null;
            } else {
                nextSortDescending = true;
            }
        }

        if (onSortChange) {
            onSortChange(nextSortPath, nextSortDescending);
        }
    };

    const handleHeadCheck = (headerChecked: boolean) => {
        onHeaderSelect([...baseItems], headerChecked);
    };

    let allColumns: SimpleTableColumn[] = columns;

    // Add first column with checkboxes if the table rows are selectable
    if (selectable) {
        let selectedCount = 0;
        if (isRowSelected) {
            for (let i = 0; i < baseItems.length; i += 1) {
                const state = isRowSelected(baseItems[i], i);
                let rowSelected: boolean;
                
                if (isBoolean(state)) {
                    rowSelected = state;
                } else if (!isNil(state)) {
                    rowSelected = state.selected;
                } else {
                    rowSelected = false;
                }
                if (rowSelected) selectedCount += 1;
            }
        }
        const headerVariant: 'check' | 'indeterminate' =
            selectedCount > 0 && selectedCount < baseItems.length
                ? 'indeterminate'
                : 'check';

        allColumns = [
            {
                headerBody: headerSelectable ? (
                    <>
                        <div className="no-display">Select</div>
                        <CheckInputField
                            id="header-check-input"
                            className="row-check-box"
                            value={isHeaderSelected ? isHeaderSelected(items) : false}
                            variant={headerVariant}
                            aria-label="Select all rows"
                            onChange={(checked) => handleHeadCheck(checked)}
                            ignoreHalo
                        />
                    </>
                ) : (
                    <div className="no-display">Select Item</div>
                ),
                renderCell: (_cellValue, item, rowIndex, selectionStatus) => (
                    <CheckInputField
                        id={`check-input-${rowIndex}`}
                        className="row-check-box"
                        value={selectionStatus.selected}
                        disabled={selectionStatus.disabled}
                        aria-label="Select row"
                        onChange={(checked) =>
                            onRowSelect(item, checked, rowIndex)
                        }
                        ignoreHalo
                    />
                ),
                width: '48px',
                sortable: false,
            },
            ...columns,
        ];
    }

    // Set left for sticky columns beyond the first so th and td elements in
    // that column will not overlap previous sticky columns when scrolling
    // horizontally
    if (stickyColumns > 1 || (pageTable && stickyColumns > 0)) {
        allColumns = reduce(
            allColumns,
            (acc: SimpleTableColumn[], col, idx) => {
                if (idx >= stickyColumns) {
                    acc.push(col);
                    return acc;
                }
                let leftPx = 0;

                forEach(acc, ({ width }) => {
                    if (!width || !width.includes('px')) {
                        throw new Error(
                            'Sticky columns other than the last must have static widths in pixels',
                        );
                    }

                    leftPx += parseInt(width, 10);
                });

                acc.push({
                    ...col,
                    left: `${leftPx}px`,
                    lastColumn: idx === stickyColumns - 1,
                });
                return acc;
            },
            [] as SimpleTableColumn[],
        );
    }

    const renderHeader = (column: SimpleTableColumn, colIndex: number) => {
        const {
            headerBody,
            headerClass,
            cellValuePath,
            width,
            left,
            cellSortPath,
            sortable = false,
            lastColumn,
        } = column;

        if (!sortable) {
            return (
                <HeaderBase
                    className={headerClass}
                    key={colIndex}
                    width={width}
                    left={left}
                    lastColumn={lastColumn}
                >
                    <HeaderCellBase>{headerBody}</HeaderCellBase>
                </HeaderBase>
            );
        }

        const newSortPath = cellSortPath ?? cellValuePath ?? null;
        let sortDirection: 'none' | 'ascending' | 'descending' = 'none';

        if (isSortPathsEqual(sortPath, newSortPath)) {
            sortDirection = sortDescending ? 'descending' : 'ascending';
        }

        return (
            <HeaderBase
                key={colIndex}
                width={width}
                left={left}
                lastColumn={lastColumn}
            >
                <HeaderSortableCellBase
                    sortDirection={sortDirection}
                    headerText={isString(headerBody) ? headerBody : null}
                    onClick={handleSort}
                    eventData={newSortPath}
                >
                    {headerBody}
                </HeaderSortableCellBase>
            </HeaderBase>
        );
    };

    const renderRow = (item: TableItem, rowIndex: number) => {
        const rowChild = renderRowChild ? renderRowChild(item, rowIndex) : null;

        let selectedState = isRowSelected
            ? isRowSelected(item, rowIndex)
            : undefined;

        if (isNil(selectedState) || isBoolean(selectedState)) {
            selectedState = { selected: selectedState === true, disabled: false };
        }

        const selectionState = selectedState as RowSelectionState;

        const cells = map(
            allColumns,
            (
                { cellValuePath, left, bold, renderCell, lastColumn },
                colIndex,
            ) => {
                let cell: React.ReactNode = '';

                if (renderCell) {
                    let cellValue: unknown = item;

                    if (!isNil(cellValuePath)) {
                        cellValue = isArray(cellValuePath)
                            ? map(cellValuePath, (path) => get(item, path, ''))
                            : get(item, cellValuePath, '');
                    }

                    cell = renderCell(cellValue, item, rowIndex, selectionState);
                } else if (cellValuePath) {
                    cell = getValueFromPath(item, cellValuePath);
                }

                return (
                    <CellBase
                        key={colIndex}
                        className={bold ? 'ra-semi-bold' : null}
                        left={left}
                        lastColumn={lastColumn}
                    >
                        {cell}
                    </CellBase>
                );
            },
        );

        return (
            <Fragment key={rowIndex}>
                <RowBase
                    key={`${rowIndex}-row`}
                    className={classnames({
                        'has-row-child': rowChild,
                        'clickable-row': onClickRow,
                    })}
                    active={selectionState.selected}
                    onClick={onClickRow}
                    eventData={{ item, rowIndex }}
                >
                    {cells}
                </RowBase>
                {rowChild ? (
                    <RowBase key={`${rowIndex}-row-child`} className="row-child">
                        {rowChild}
                    </RowBase>
                ) : null}
            </Fragment>
        );
    };

    return (
        <TableBase
            id={id}
            className={classnames(
                'ra-simple-table',
                selectable ? 'selectable' : '',
                className,
            )}
            minWidth={minWidth}
            maxHeight={maxHeight}
            pageTable={pageTable}
            stickyColumns={stickyColumns}
            columnWidthsFitContent={columnWidthsFitContent}
            useParentScroll={useParentScroll}
        >
            <HeadBase>
                <RowBase>{map(allColumns, renderHeader)}</RowBase>
            </HeadBase>
            <BodyBase>{map(baseItems, renderRow)}</BodyBase>
        </TableBase>
    );
}
