export default Button;
declare class Button extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        type: any;
        color: any;
        variant: any;
        useDark: any;
        size: any;
        onClick: any;
        children: any;
        rounded: any;
        noPadding: any;
        dockSide: any;
        asAnchor: any;
        href: any;
        target: any;
        focusOnMount: any;
    };
    static defaultProps: {
        id: null;
        type: string;
        className: null;
        variant: string;
        color: null;
        onClick: null;
        children: null;
        rounded: boolean;
        size: string;
        noPadding: boolean;
        dockSide: null;
        asAnchor: boolean;
        href: null;
        target: null;
        useDark: boolean;
        focusOnMount: boolean;
    };
    constructor(props: any);
    buttonRef: React.RefObject<any>;
    focus(): void;
    handleClick(event: any): void;
    componentDidMount(): void;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=button-orig.d.ts.map