export default Button;
declare class Button extends React.PureComponent<any, any, any> {
    static propTypes: {
        className: any;
        Component: any;
        color: any;
        design: any;
        variant: any;
        children: any;
        focusOnMount: any;
    };
    static defaultProps: {
        Component: string;
        className: null;
        design: null;
        color: null;
        children: null;
        variant: null;
        focusOnMount: boolean;
    };
    constructor(props: any);
    buttonRef: React.RefObject<any>;
    focus(): void;
    componentDidMount(): void;
    getRootNode(): any;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=button.d.ts.map