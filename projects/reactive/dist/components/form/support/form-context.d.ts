import React from 'react';
import { Data, Property } from '@reformjs/reactive-data';
export interface FormConfig {
    validateOnBlur: boolean;
}
export interface FormMeta {
    ancestorProperty: Property;
    data: Data;
    config: FormConfig;
}
interface Base {
    [key: string]: any;
}
export interface PropertyConsumerComponentProps extends Base {
    property: Property;
    data: Data;
    validateOnBlur: boolean;
}
interface PropertyConsumerProps extends Base {
    path?: string;
}
export declare function ApplyFormPropertyConsumer<T>(Component: React.ComponentType<T & PropertyConsumerComponentProps>): (props: PropertyConsumerProps & T) => React.JSX.Element;
export interface FormContextProviderProps extends FormMeta {
    children: React.ReactNode;
}
export declare function FormContextProvider(props: FormContextProviderProps): React.JSX.Element;
export {};
//# sourceMappingURL=form-context.d.ts.map