export default InputValueBuffer;
declare class InputValueBuffer extends React.PureComponent<any, any, any> {
    static propTypes: {
        value: any;
        onChange: any;
        children: any;
    };
    static defaultProps: {
        value: null;
        onChange: (...args: any[]) => void;
    };
    static getDerivedStateFromProps(nextProps: any, currentState: any): {
        value: any;
    } | null;
    constructor(props: any);
    handleChange(newValue: any): void;
    state: {
        value: any;
        previousValue: any;
    };
    render(): any;
}
import React from 'react';
//# sourceMappingURL=input-field-value-buffer.d.ts.map