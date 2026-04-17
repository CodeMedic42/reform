export default InputLabel;
declare class InputLabel extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        label: any;
        messages: any;
        failure: any;
        'aria-labelledby': any;
        'aria-describedby': any;
        hidden: any;
        disabled: any;
        size: any;
        children: any;
    };
    static defaultProps: {
        id: null;
        messages: null;
        failure: boolean;
        className: null;
        label: null;
        'aria-labelledby': null;
        'aria-describedby': null;
        hidden: boolean;
        disabled: boolean;
        size: string;
    };
    static getDerivedStateFromProps(nextProps: any, currentState: any): {
        finalId: any;
        labelId: string;
        inputId: string;
        labelledBy: string;
        describedBy: string | null;
        descriptionId: string | null;
    };
    constructor(props: any);
    labelRef: React.RefObject<any>;
    inputContainerRef: React.RefObject<any>;
    labelPreventDefault(event: any): void;
    state: {
        labelId: null;
        inputId: null;
        descriptionId: null;
        labelledBy: null;
        baseId: string;
    };
    getInputElement(): any;
    focus(): void;
    render(): React.JSX.Element;
}
declare const exportPropTypes: {
    id: any;
    className: any;
    label: any;
    messages: any;
    failure: any;
    'aria-labelledby': any;
    'aria-describedby': any;
    hidden: any;
    disabled: any;
    size: any;
};
declare const exportDefaultProps: {
    id: null;
    messages: null;
    failure: boolean;
    className: null;
    label: null;
    'aria-labelledby': null;
    'aria-describedby': null;
    hidden: boolean;
    disabled: boolean;
    size: string;
};
import React from 'react';
export { exportPropTypes as propTypes, exportDefaultProps as defaultProps };
//# sourceMappingURL=input-field-label.d.ts.map