export default MenuList;
declare class MenuList extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        children: null;
    };
    constructor(...args: any[]);
    listRef: React.RefObject<any>;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-list.d.ts.map