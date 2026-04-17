export default MenuText;
declare class MenuText extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        menuIcon: any;
        children: any;
        selected: any;
        targeted: any;
        borderBottom: any;
        borderTop: any;
        icon: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        selected: boolean;
        targeted: boolean;
        menuIcon: null;
        children: null;
        borderBottom: boolean;
        borderTop: boolean;
        icon: null;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    renderListItemContent(): React.ReactNode;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-text.d.ts.map