import React, { Component } from 'react';
export interface ExternalBoundaryPropsInt {
    onExternalClick?: (event: MouseEvent) => void;
    cancelExternalScroll?: boolean;
}
declare class ExternalBoundary extends Component<ExternalBoundaryPropsInt> {
    static defaultProps: {
        onExternalClick: null;
        cancelExternalScroll: boolean;
    };
    private clickedInside;
    private boundaryRef;
    private clickListenerUpdate?;
    private wheelListenerUpdate?;
    constructor(props: ExternalBoundaryPropsInt);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    handleCaptureClick(): void;
    isClicked(): boolean;
    private applyWheel;
    private applyClick;
    render(): React.JSX.Element;
}
export default ExternalBoundary;
//# sourceMappingURL=external-boundary.d.ts.map