export default MenuLink;
declare class MenuLink extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        icon: any;
        children: any;
        onClick: any;
        'aria-label': any;
        onClickMeta: any;
        selected: any;
        targeted: any;
        disabled: any;
        href: any;
        borderBottom: any;
        borderTop: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        onClick: null;
        onClickMeta: null;
        selected: boolean;
        targeted: boolean;
        disabled: boolean;
        icon: null;
        children: null;
        href: null;
        borderBottom: boolean;
        borderTop: boolean;
        'aria-label': null;
    };
    constructor(props: any);
    handleClick({ event }: {
        event: any;
    }): void;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-link.d.ts.map