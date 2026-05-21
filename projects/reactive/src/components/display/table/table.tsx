import React, { Fragment, PureComponent } from 'react';
import classnames from 'classnames';
import {
    get,
    map,
    slice,
    isString,
    isNil,
    noop,
    isEqual,
    forEach,
    join,
    isArray,
    isEmpty,
    isBoolean,
    reduce,
    orderBy,
    words,
    escapeRegExp,
    filter,
} from 'lodash-es';
// memoize-one ships an ESM `.d.ts` (`export default memoizeOne`) but a CJS
// runtime (`module.exports = memoizeOne`). Under `moduleResolution: nodenext`
// TypeScript resolves the package as CJS and treats the default-import as the
// namespace, which then appears non-callable. The runtime value IS the
// function, so cast to a callable shape that preserves the wrapped fn's type.
import memoizeOneDefault from 'memoize-one';
const memoize = memoizeOneDefault as unknown as <T extends (...args: never[]) => unknown>(fn: T) => T;
import TableBase from './base/table-base.js';
import HeadBase from './base/head-base.js';
import HeaderBase from './base/header-base.js';
import BodyBase from './base/body-base.js';
import RowBase from './base/row-base.js';
import CellBase from './base/cell-base.js';
import HeaderCellBase from './base/header-cell-base.js';
import HeaderSortableCellBase from './base/header-sortable-cell-base.js';

// TODO: replace this stub with the real `@reformjs/reactive/fields/check-input-field`
//   and adapt the `onChange` callbacks to the new (checked, meta) signature when
//   the simple-table API is reworked. Until then, the `selectable` column
//   renders empty cells where the checkboxes used to be.
interface CheckInputStubProps {
    id?: string;
    className?: string;
    value?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onChange?: (checked: boolean) => void;
    'aria-label'?: string;
    ignoreHalo?: boolean;
}

function CheckInput(_props: CheckInputStubProps): React.ReactElement | null {
    return null;
}

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
    cellFilterPath?: SortPath;
    filterable?: boolean;
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

/** Row click event. `meta` is typed as `unknown` to match RowBase; in practice
 * this Table always provides `{ item, rowIndex }` (see {@link RowClickMeta}). */
interface RowClickEvent {
    event: React.MouseEvent<HTMLTableRowElement>;
    meta: unknown;
}

/** Sortable-header click event. `meta` is typed as `unknown` to match
 *  HeaderSortableCellBase; this Table always sets `onClickMeta` to the column's
 *  sort path, so handleSort narrows it to {@link SortPath}. */
interface SortClickEvent {
    event: React.MouseEvent<HTMLButtonElement>;
    meta: unknown;
}

export interface SimpleTableProps {
    id?: string | null;
    className?: string | null;
    items?: TableItem[] | Record<string, TableItem> | null;
    columns: SimpleTableColumn[];
    filterText?: string | null;
    alwaysShowHeaders?: boolean;
    minWidth?: number | null;
    maxHeight?: number | null;
    pageTable?: boolean;
    initialSortPath?: SortPath | null;
    initialSortDescending?: boolean;
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
    isRowFiltered?: ((item: TableItem, filterText: string | null) => boolean) | null;
    onClickRow?: ((event: RowClickEvent) => void) | null;
    currentPage?: number | null;
    recordsPerPage?: number | null;
    useParentScroll?: boolean;
    onFilteredItemsChange?: ((items: TableItem[]) => void) | null;
    onSortChange?: ((sortPath: SortPath | null, sortDescending: boolean) => void) | null;
    disableInternalSorting?: boolean;
}

interface SimpleTableState {
    sortPath: SortPath | null;
    sortDescending: boolean;
    disableInternalSorting: boolean;
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

/**
 * Builds the filter regex used to filter table rows from the filterText
 * string. Matching rows must have values strings that partially match each
 * word in filterText.
 */
function buildFilterRegex(filterText: string): RegExp {
    const filterWords = words(filterText, /[^\s]+/g);

    // Construct a regex lookahead for each word, which is how to do AND
    // operators in regex
    let regexStr = '';
    forEach(filterWords, (word) => {
        regexStr = `${regexStr}(?=.*${escapeRegExp(word)})`;
    });

    return new RegExp(`^${regexStr}.*$`, 'i');
}

function sortItems(
    items: TableItem[],
    sortPath: SortPath | null,
    sortDescending: boolean,
): TableItem[] {
    if (!sortPath) {
        return items;
    }

    return orderBy(
        items,
        (item) => {
            if (isArray(sortPath)) {
                return map(sortPath, (path) => {
                    const ref = (get(item, path) ?? '') as unknown;
                    if (typeof ref === 'string') {
                        return ref.toLowerCase();
                    }
                    return ref;
                });
            }
            const ref = (get(item, sortPath) ?? '') as unknown;
            if (typeof ref === 'string') {
                return ref.toLowerCase();
            }
            return ref;
        },
        sortDescending ? 'desc' : 'asc',
    );
}

function filterItems(
    items: TableItem[],
    columns: SimpleTableColumn[],
    isRowFiltered: SimpleTableProps['isRowFiltered'],
    filterText: string | null | undefined,
): TableItem[] {
    let filterRegex: RegExp | null = null;

    if (filterText && filterText.length > 0) {
        filterRegex = buildFilterRegex(filterText);
    }

    if (isNil(filterRegex) && isNil(isRowFiltered)) {
        return items;
    }

    return filter(items, (item) => {
        let rowFilterString = '';

        if (!isNil(isRowFiltered) && isRowFiltered(item, filterText ?? null)) {
            return false;
        }

        if (isNil(filterRegex)) {
            return true;
        }

        forEach(columns, (column) => {
            const { renderCell, cellValuePath, filterable, cellFilterPath } = column;

            let cellFilterString = '';
            if (!renderCell && cellValuePath) {
                cellFilterString = getValueFromPath(item, cellValuePath);
            }

            if (filterable) {
                if (cellFilterPath) {
                    cellFilterString = getValueFromPath(item, cellFilterPath);
                }
            } else if (isEmpty(cellFilterString)) {
                cellFilterString = getValueFromPath(item, cellValuePath);
            }

            if (!isEmpty(cellFilterString)) {
                rowFilterString = `${rowFilterString} ${cellFilterString}`;
            }
        });

        return rowFilterString.match(filterRegex) !== null;
    });
}

function getPageItems(
    items: TableItem[],
    currentPage: number | null | undefined,
    recordsPerPage: number | null | undefined,
): TableItem[] {
    if (
        isNil(currentPage)
        || currentPage <= 0
        || isNil(recordsPerPage)
        || recordsPerPage < 1
    ) {
        return items;
    }

    return slice(
        items,
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage,
    );
}

export default class Table extends PureComponent<SimpleTableProps, SimpleTableState> {
    static defaultProps: Partial<SimpleTableProps> = {
        id: null,
        className: '',
        items: null,
        filterText: null,
        alwaysShowHeaders: false,
        minWidth: null,
        maxHeight: null,
        pageTable: false,
        initialSortPath: null,
        initialSortDescending: false,
        paddingSize: 'md',
        stickyColumns: 0,
        columnWidthsFitContent: false,
        headerSelectable: false,
        selectable: false,
        isHeaderSelected: () => false,
        isRowSelected: () => false,
        onHeaderSelect: noop,
        onRowSelect: noop,
        renderRowChild: null,
        isRowFiltered: null,
        onClickRow: null,
        currentPage: null,
        recordsPerPage: null,
        useParentScroll: false,
        onFilteredItemsChange: null,
        onSortChange: null,
        disableInternalSorting: false,
        sortPath: null,
        sortDescending: false,
    };

    allColumns: SimpleTableColumn[] = [];
    finalItems: TableItem[] = [];
    sortItems: typeof sortItems;
    filterItems: typeof filterItems;
    getPageItems: typeof getPageItems;

    constructor(props: SimpleTableProps) {
        super(props);
        const {
            initialSortPath,
            initialSortDescending,
            disableInternalSorting,
            sortPath,
            sortDescending,
        } = props;

        this.state = {
            sortPath: disableInternalSorting ? sortPath ?? null : initialSortPath ?? null,
            sortDescending: disableInternalSorting
                ? sortDescending ?? false
                : initialSortDescending ?? false,
            disableInternalSorting: disableInternalSorting ?? false,
        };

        this.handleHeadCheck = this.handleHeadCheck.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);

        this.sortItems = memoize(sortItems);
        this.filterItems = memoize(filterItems);
        this.getPageItems = memoize(getPageItems);
    }

    static getDerivedStateFromProps(
        nextProps: SimpleTableProps,
        currentState: SimpleTableState,
    ): Partial<SimpleTableState> | null {
        const { disableInternalSorting } = currentState;

        if (!disableInternalSorting) {
            return null;
        }

        const { sortPath, sortDescending } = nextProps;

        return {
            sortPath: sortPath ?? null,
            sortDescending: sortDescending ?? false,
        };
    }

    handleHeadCheck(headerChecked: boolean) {
        const { onHeaderSelect } = this.props;

        if (onHeaderSelect) {
            onHeaderSelect([...this.finalItems], headerChecked);
        }
    }

    handleSort({ meta }: SortClickEvent) {
        const { onSortChange } = this.props;

        const { disableInternalSorting } = this.state;

        let { sortPath, sortDescending } = this.state;
        let path = meta as SortPath | null;

        if (isSortPathsEqual(path, sortPath)) {
            if (sortDescending) {
                sortPath = null;
                sortDescending = false;
            } else {
                sortPath = path;
                sortDescending = true;
            }
        } else {
            sortPath = path;
            sortDescending = false;
        }

        if (onSortChange) {
            onSortChange(sortPath, sortDescending);
        }

        if (!disableInternalSorting) {
            this.setState({ sortPath, sortDescending });
        }
    }

    setSorting(sortPath: SortPath | null, sortDescending: boolean) {
        const { onSortChange } = this.props;

        const { disableInternalSorting } = this.state;

        if (disableInternalSorting) {
            return;
        }

        if (onSortChange) {
            onSortChange(sortPath, sortDescending);
        }

        this.setState({ sortPath, sortDescending });
    }

    getFilteredItems(): TableItem[] {
        return [...this.finalItems];
    }

    renderHeader(column: SimpleTableColumn, colIndex: number) {
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

        const { sortPath, sortDescending } = this.state;

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
                    onClick={this.handleSort}
                    onClickMeta={newSortPath}
                >
                    {headerBody}
                </HeaderSortableCellBase>
            </HeaderBase>
        );
    }

    renderRow(item: TableItem, rowIndex: number) {
        const { renderRowChild, isRowSelected, onClickRow } = this.props;

        const rowChild = renderRowChild ? renderRowChild(item, rowIndex) : null;

        let selectedState = isRowSelected
            ? isRowSelected(item, rowIndex)
            : undefined;

        if (isNil(selectedState) || isBoolean(selectedState)) {
            selectedState = { selected: selectedState === true, disabled: false };
        }

        const selectionState = selectedState as RowSelectionState;

        const cells = map(
            this.allColumns,
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
                    onClickMeta={{ item, rowIndex }}
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
    }

    render() {
        const {
            id,
            className,
            items,
            columns,
            filterText,
            alwaysShowHeaders,
            minWidth,
            maxHeight,
            pageTable,
            paddingSize,
            stickyColumns = 0,
            columnWidthsFitContent,
            selectable,
            headerSelectable,
            isHeaderSelected,
            onRowSelect,
            isRowFiltered,
            currentPage,
            recordsPerPage,
            useParentScroll,
            onFilteredItemsChange,
        } = this.props;

        this.allColumns = columns;

        const { sortPath, sortDescending, disableInternalSorting } = this.state;

        const baseItems = isArray(items)
            ? items
            : !isNil(items)
                ? Object.values(items)
                : [];

        if (baseItems.length === 0 && !alwaysShowHeaders) {
            return null;
        }

        let finalItems = this.filterItems(
            baseItems,
            columns,
            isRowFiltered,
            filterText,
        );

        if (!disableInternalSorting) {
            finalItems = this.sortItems(finalItems, sortPath, sortDescending);
        }

        if (onFilteredItemsChange) {
            onFilteredItemsChange(finalItems);
        }

        finalItems = this.getPageItems(finalItems, currentPage, recordsPerPage);
        this.finalItems = finalItems;

        // Add first column with checkboxes if the table rows are selectable
        if (selectable) {
            this.allColumns = [
                {
                    headerBody: headerSelectable ? (
                        <>
                            <div className="no-display">Select</div>
                            <CheckInput
                                id="header-check-input"
                                className="row-check-box"
                                value={isHeaderSelected ? isHeaderSelected(items) : false}
                                aria-label="Select all rows"
                                size="sm"
                                onChange={this.handleHeadCheck}
                                ignoreHalo
                            />
                        </>
                    ) : (
                        <div className="no-display">Select Item</div>
                    ),
                    renderCell: (_cellValue, item, rowIndex, selectionStatus) => (
                        <CheckInput
                            id={`check-input-${rowIndex}`}
                            className="row-check-box"
                            value={selectionStatus.selected}
                            disabled={selectionStatus.disabled}
                            aria-label="Select row"
                            size="sm"
                            onChange={(newChecked: boolean) =>
                                onRowSelect && onRowSelect(item, newChecked, rowIndex)
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
            this.allColumns = reduce(
                this.allColumns,
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
                    <RowBase>{map(this.allColumns, this.renderHeader)}</RowBase>
                </HeadBase>
                <BodyBase>{map(this.finalItems, this.renderRow)}</BodyBase>
            </TableBase>
        );
    }
}
