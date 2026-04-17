export default MenuItem;
declare class MenuItem extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
        selected: any;
        targeted: any;
        onMouseEnter: any;
        onMouseLeave: any;
        borderBottom: any;
        borderTop: any;
        onClick: any;
        preventCloseOnClick: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        children: null;
        selected: boolean;
        targeted: boolean;
        onMouseEnter: null;
        onMouseLeave: null;
        borderBottom: boolean;
        borderTop: boolean;
        onClick: null;
        preventCloseOnClick: boolean;
    };
    constructor(props: any);
    itemRef: React.RefObject<any>;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-item.d.ts.map