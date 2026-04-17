import React from 'react';
type StaticType = `static:${number}`;
type JustifyType = null | 'left' | 'center' | 'right';
type AlignType = null | 'top' | 'center' | 'bottom';
type ColumnType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type WidthType = null | 'fill' | 'content' | ColumnType | StaticType;
type OffsetType = null | 'fill' | ColumnType | StaticType;
type BaseWidthType = null | StaticType;
type OrderType = null | `${number}`;
export interface ColumnProps {
    className?: string;
    justify?: (JustifyType | JustifyType[]);
    align?: (AlignType | AlignType[]);
    width?: (WidthType | WidthType[]);
    minWidth?: (BaseWidthType | BaseWidthType[]);
    maxWidth?: (BaseWidthType | BaseWidthType[]);
    paddingTop?: (BaseWidthType | BaseWidthType[]);
    leftOffset?: (OffsetType | OffsetType[]);
    rightOffset?: (OffsetType | OffsetType[]);
    order?: OrderType | OrderType[];
    useContentBox?: boolean;
    style?: object;
    children?: JSX.Element | JSX.Element[];
}
declare function Column(props: ColumnProps): React.JSX.Element;
declare namespace Column {
    var defaultProps: {
        className: null;
        justify: null;
        align: null;
        width: null;
        minWidth: null;
        maxWidth: null;
        paddingTop: null;
        leftOffset: null;
        rightOffset: null;
        order: null;
        useContentBox: null;
        style: null;
        children: null;
    };
}
export default Column;
//# sourceMappingURL=column.d.ts.map