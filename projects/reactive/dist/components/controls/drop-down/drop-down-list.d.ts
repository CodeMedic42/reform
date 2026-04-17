export default DropDownList;
/**
 * This component is used within the Tray component. It is normally used within the DropDown component.
 */
declare class DropDownList extends React.Component<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
        size: any;
        'aria-labelledby': any;
    };
    static defaultProps: {
        id: null;
        className: null;
        children: null;
        size: null;
        'aria-labelledby': null;
    };
    constructor(props: any);
    listRef: React.RefObject<any>;
    handleWheel(event: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getRootNode(): any;
    scrollToIndex(index: any): void;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=drop-down-list.d.ts.map