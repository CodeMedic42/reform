export default TabGroup;
declare class TabGroup extends React.PureComponent<any, any, any> {
    static propTypes: {
        defaultTabId: any;
        size: any;
        justify: any;
        color: any;
        background: any;
        border: any;
        tabs: any;
        onMove: any;
        onMoveMeta: any;
    };
    static defaultProps: {
        defaultTabId: null;
        size: string;
        justify: boolean;
        background: boolean;
        border: boolean;
        color: string;
        onMove: null;
        onMoveMeta: null;
    };
    constructor(props: any);
    handleSelect(tabId: any): void;
    state: {
        selectedTabId: null;
    };
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=tab-group.d.ts.map