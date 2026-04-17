import React__default from 'react';

type GutterValueType = string;
type gutterType = GutterValueType | GutterValueType[];
interface ContainerProps {
    className?: string;
    gutter?: gutterType;
    hideOverflow?: boolean;
    children?: JSX.Element | JSX.Element[];
    style?: {
        [key: string]: string | number | boolean | null | undefined;
    };
}
declare function Container(props: ContainerProps): React__default.JSX.Element;
declare namespace Container {
    var defaultProps: {
        className: null;
        gutter: null;
        hideOverflow: null;
        children: null;
        style: null;
    };
}

declare const _default: React__default.ForwardRefExoticComponent<Omit<any, "ref"> & React__default.RefAttributes<any>>;

type StaticType = `static:${number}`;
type JustifyType = null | 'left' | 'center' | 'right';
type AlignType = null | 'top' | 'center' | 'bottom';
type ColumnType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type WidthType = null | 'fill' | 'content' | ColumnType | StaticType;
type OffsetType = null | 'fill' | ColumnType | StaticType;
type BaseWidthType = null | StaticType;
type OrderType = null | `${number}`;
interface ColumnProps {
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
declare function Column(props: ColumnProps): React__default.JSX.Element;
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

export { Column, Container, _default as Row };
