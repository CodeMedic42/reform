export default MenuCheck;
declare class MenuCheck extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
        borderBottom: any;
        borderTop: any;
        value: any;
        onChange: any;
        disabled: any;
        variant: any;
        icon: any;
        'aria-label': any;
    };
    static defaultProps: {
        id: null;
        className: null;
        children: null;
        borderBottom: boolean;
        borderTop: boolean;
        value: boolean;
        onChange: null;
        disabled: boolean;
        variant: null;
        icon: null;
        'aria-label': null;
    };
    constructor(props: any);
    itemRef: React.RefObject<any>;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-check.d.ts.map