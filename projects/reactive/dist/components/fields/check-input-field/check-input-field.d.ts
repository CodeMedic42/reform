export default CheckInput;
declare class CheckInput extends React.PureComponent<any, any, any> {
    static propTypes: {
        id: any;
        className: any;
        label: any;
        messages: any;
        'aria-label': any;
        'aria-labelledby': any;
        'aria-describedby': any;
        title: any;
        color: any;
        variant: any;
        value: any;
        size: any;
        onChange: any;
        onChangeMeta: any;
        onClick: any;
        onClickMeta: any;
        disabled: any;
        hidden: any;
        ignoreHalo: any;
        constrictField: any;
    };
    static defaultProps: {
        id: null;
        className: null;
        value: boolean;
        variant: string;
        label: null;
        messages: null;
        'aria-label': null;
        'aria-labelledby': null;
        'aria-describedby': null;
        title: null;
        color: string;
        size: string;
        onChange: null;
        onChangeMeta: null;
        onClick: null;
        onClickMeta: null;
        disabled: boolean;
        hidden: boolean;
        ignoreHalo: boolean;
        constrictField: boolean;
    };
    static getDerivedStateFromProps(nextProps: any): {
        inputId: string;
        labelId: string | null;
        descriptionId: string;
        labelledBy: string;
        describedBy: string | null;
        ariaLabel: any;
    } | null;
    constructor(props: any);
    inputRef: React.RefObject<any>;
    handleChange(event: any): void;
    handleClick(event: any): void;
    state: {};
    componentDidMount(): void;
    componentDidUpdate(): void;
    setCheckedAttribute(): void;
    render(): React.JSX.Element;
}
import React from 'react';
//# sourceMappingURL=check-input-field.d.ts.map