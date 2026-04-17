export default BaseCursorInput;
declare class BaseCursorInput extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        value: any;
        disabled: any;
        onChange: any;
        onClear: any;
        size: any;
        leftIcon: any;
        rightIcon: any;
        children: any;
        hideClearButton: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        value: null;
        disabled: boolean;
        onClear: null;
        leftIcon: null;
        rightIcon: null;
        hideClearButton: boolean;
        size: string;
        onChange: (...args: any[]) => void;
    };
    static getDerivedStateFromProps(nextProps: any, currentState: any): {
        value: any;
        nextValue: any;
    };
    constructor(props: any);
    handleChange(value: any): void;
    handleClear(): void;
    handleMouseDown(event: any): void;
    state: {
        value: any;
        nextValue: any;
    };
    renderIcon(className: any, icon: any, onClick: any): React.JSX.Element;
    renderLeftAnnotation(): React.JSX.Element | null;
    renderRightAnnotation(): React.JSX.Element | null;
    render(): React.JSX.Element;
}
declare namespace exportPropTypes {
    let id: any;
    let className: any;
    let value: any;
    let disabled: any;
    let onChange: any;
    let onClear: any;
    let size: any;
    let leftIcon: any;
    let rightIcon: any;
}
declare namespace exportDefaultProps {
    let id_1: null;
    export { id_1 as id };
    let className_1: null;
    export { className_1 as className };
    let value_1: null;
    export { value_1 as value };
    let disabled_1: boolean;
    export { disabled_1 as disabled };
    let onClear_1: null;
    export { onClear_1 as onClear };
    let leftIcon_1: null;
    export { leftIcon_1 as leftIcon };
    let rightIcon_1: null;
    export { rightIcon_1 as rightIcon };
    export let hideClearButton: boolean;
    let size_1: string;
    export { size_1 as size };
    export { noop as onChange };
}
import React from 'react';
import { noop } from 'lodash-es';
export { exportPropTypes as propTypes, exportDefaultProps as defaultProps };
//# sourceMappingURL=base-cursor-input-field.d.ts.map