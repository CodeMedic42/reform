export default Tray;
declare class Tray extends React.Component<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        children: any;
        open: any;
        dropPositions: any;
        getAnchor: any;
        onClick: any;
        parentPadding: any;
        onContainedFocus: any;
        onContainedBlur: any;
        minWidth: any;
        maxWidth: any;
        maxHeight: any;
        offset: any;
        horizontallyCenter: any;
        dockRight: any;
        enableTail: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        open: boolean;
        children: null;
        dropPositions: string[];
        onClick: null;
        parentPadding: null;
        onContainedFocus: null;
        onContainedBlur: null;
        minWidth: null;
        maxWidth: null;
        maxHeight: null;
        offset: null;
        horizontallyCenter: boolean;
        dockRight: boolean;
        enableTail: boolean;
    };
    static contextType: React.Context<{
        renderIndex: number;
        onRegister: () => (...args: any[]) => void;
    }>;
    constructor(props: any);
    uuid: string;
    trayRef: React.RefObject<any>;
    tailRef: React.RefObject<any>;
    childTrays: {};
    cleanUp: (...args: any[]) => void;
    pendingBlur: boolean;
    handleBlur(event: any): void;
    handleFocus(): void;
    handleRegister(component: any): () => void;
    componentDidMount(): void;
    componentDidUpdate(previousProps: any): void;
    componentWillUnmount(): void;
    rootElement(): any;
    contains(targetElement: any): boolean;
    updatePosition(isOpen: any, wasOpen: any): void;
    render(): React.ReactPortal;
}
import React from 'react';
//# sourceMappingURL=tray.d.ts.map