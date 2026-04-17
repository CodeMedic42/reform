import { Data, Property, RulesStatus } from '@reformjs/reactive-data';
export interface FormAccessControl<T> {
    property: Property;
    data: Data;
    value: T;
    valid: {
        property: boolean;
        data: boolean;
    };
    setValue: (newValue: T) => void;
    validation: RulesStatus;
    validateOnBlur: boolean;
}
export interface FormAccessProps<T> {
    children: (accessControl: FormAccessControl<T>) => React.ReactNode;
    property: Property;
    data: Data;
    validateOnBlur: boolean;
    listenToData: boolean;
    listenToProperty: boolean;
}
declare const _default: (props: any) => import("react").JSX.Element;
export default _default;
//# sourceMappingURL=form-access.d.ts.map