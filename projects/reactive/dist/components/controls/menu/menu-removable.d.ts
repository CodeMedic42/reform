export default MenuRemovable;
declare class MenuRemovable extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
        onRemove: any;
        onRemoveMeta: any;
        selected: any;
        targeted: any;
        disabled: any;
        borderBottom: any;
        borderTop: any;
        icon: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        onRemove: null;
        onRemoveMeta: null;
        selected: boolean;
        targeted: boolean;
        disabled: boolean;
        children: null;
        borderBottom: boolean;
        borderTop: boolean;
        icon: null;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-removable.d.ts.map