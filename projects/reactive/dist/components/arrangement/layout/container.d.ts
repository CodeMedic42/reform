import React from 'react';
type GutterValueType = string;
type gutterType = GutterValueType | GutterValueType[];
export interface ContainerProps {
    className?: string;
    gutter?: gutterType;
    hideOverflow?: boolean;
    children?: JSX.Element | JSX.Element[];
    style?: {
        [key: string]: string | number | boolean | null | undefined;
    };
}
declare function Container(props: ContainerProps): React.JSX.Element;
declare namespace Container {
    var defaultProps: {
        className: null;
        gutter: null;
        hideOverflow: null;
        children: null;
        style: null;
    };
}
export default Container;
//# sourceMappingURL=container.d.ts.map