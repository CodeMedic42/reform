export default MenuButton;
declare class MenuButton extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        icon: any;
        children: any;
        onClick: any;
        onClickMeta: any;
        selected: any;
        targeted: any;
        disabled: any;
        borderBottom: any;
        borderTop: any;
        'aria-label': any;
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
        borderBottom: null;
        borderTop: boolean;
        'aria-label': null;
    };
    constructor(props: any);
    itemRef: React.RefObject<any>;
    handleClick({ event }: {
        event: any;
    }): void;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=menu-button.d.ts.map