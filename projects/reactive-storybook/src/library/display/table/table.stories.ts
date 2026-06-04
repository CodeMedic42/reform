import Table from '@reformjs/reactive/display/table';

export default {
    title: 'Display/Table',
    component: Table,
};

// Table showcases
export { default as RealPageLevel } from './stories/real/page-level';
export { default as Minimum } from './stories/basic/minimum';
export { default as ColumnWidthsFitContent } from './stories/basic/column-widths-fit-content';
export { default as Sorting } from './stories/basic/sorting';

export { default as StickyBasic } from './stories/sticky/basic';
// export { default as basicOld } from './stories/basic-old';
// export { default as rowChild } from './stories/row-child';
// export { default as scrollContainer } from './stories/scroll-container';
// export { default as selfContained } from './stories/self-contained';

// // Base building-block showcases (TableBase, HeadBase, RowBase, etc.)
// export { default as columnWidths } from './stories/column-widths';
// export { default as rowAndColSpan } from './stories/row-and-col-span';
// export { default as sticky } from './stories/sticky';

// TODO: port `selectable` and `filterable` once the Table's
//   CheckField wiring is updated to use fields/check-field and the
//   reactive Data context exists in this project.
