export default InputValue;
declare class InputValue extends React.PureComponent<any, any, any> {
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
        nextValue: any;
    };
    constructor(props: any);
    handleChange(value: any): void;
    state: {
        value: any;
        nextValue: any;
    };
    render(): any;
}
import React from 'react';
//# sourceMappingURL=input-field-value.d.ts.map