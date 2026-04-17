export default Chip;
declare class Chip extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        color: any;
        shade: any;
        size: any;
        disabled: any;
        floating: any;
        children: any;
        variant: any;
        onClick: any;
        onClickMeta: any;
        asButton: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        shade: string;
        children: null;
        size: string;
        floating: boolean;
        variant: string;
        onClick: null;
        onClickMeta: null;
        disabled: boolean;
        asButton: boolean;
        color: null;
    };
    constructor(props: any);
    buttonRef: React.RefObject<any>;
    handleClick(event: any): void;
    focus(): void;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=chip.d.ts.map