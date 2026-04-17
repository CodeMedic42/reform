export default Menu;
declare class Menu extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        Anchor: any;
        anchorProps: any;
        size: any;
        dark: any;
        children: any;
        disabled: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        Anchor: null;
        anchorProps: null;
        children: null;
        size: string;
        dark: boolean;
        disabled: boolean;
    };
    constructor(props: any);
    constructor(props: any, context: any);
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu.d.ts.map