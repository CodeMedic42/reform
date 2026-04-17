import * as React$1 from 'react';
import React__default from 'react';
import { Data, Property, RulesStatus } from '@reformjs/reactive-data';

interface FormProps {
    id?: string;
    className?: string;
    data: Data;
    children?: any;
    'aria-label'?: string;
    onExecute?: Function;
    validateOnBlur?: boolean;
    validateOnExecute?: boolean;
}
declare function Form(props: FormProps): React__default.JSX.Element;

type FormListProps<C extends React__default.ElementType> = {
    InnerComponent?: C;
    EmptyComponent?: React__default.ElementType;
    InnerItemComponent?: React__default.ElementType;
    path: string;
    className?: string;
    children: React__default.ReactNode;
    validateOnBlur?: boolean;
} & Omit<React__default.ComponentPropsWithoutRef<C>, 'className' | 'children'>;
declare function FormList<C extends React__default.ElementType = 'fieldset'>({ path, className, children, InnerComponent, EmptyComponent, InnerItemComponent, validateOnBlur, ...rest }: FormListProps<C>): React__default.JSX.Element;

type FormGroupProps<C extends React__default.ElementType> = {
    InnerComponent?: C;
    path: string;
    className?: string;
    children: React__default.ReactNode;
    validateOnBlur?: boolean;
} & Omit<React__default.ComponentPropsWithoutRef<C>, 'className' | 'children'>;
declare function FormGroup<C extends React__default.ElementType = 'fieldset'>({ InnerComponent, path, className, children, validateOnBlur, ...rest }: FormGroupProps<C>): React__default.JSX.Element;

interface FormAccessControl<T> {
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
interface FormAccessProps<T> {
    children: (accessControl: FormAccessControl<T>) => React.ReactNode;
    property: Property;
    data: Data;
    validateOnBlur: boolean;
    listenToData: boolean;
    listenToProperty: boolean;
}
declare const _default$2: (props: any) => React$1.JSX.Element;

interface FormButtonProps extends Omit<React__default.ComponentPropsWithoutRef<'button'>, 'onClick'> {
    path?: string;
    className?: string;
    children: React__default.ReactNode;
    onClick?: (event: React__default.MouseEvent<HTMLButtonElement>, form: {
        property: Property;
        data: Data;
    }) => void;
}
declare function FormButton(props: FormButtonProps): React__default.JSX.Element;

declare const _default$1: {
    FormButton: typeof FormButton;
};

interface FormInputTextFieldProps$2 {
    className?: string;
    path: string;
    validation?: any;
    validateOnBlur?: boolean;
}
declare function FormInputNumericField(props: FormInputTextFieldProps$2): React__default.JSX.Element;

interface FormInputTextFieldProps$1 {
    className?: string;
    path: string;
    validation?: any;
    validateOnBlur?: boolean;
}
declare function FormTextAreaField(props: FormInputTextFieldProps$1): React__default.JSX.Element;

interface FormInputTextFieldProps {
    className?: string;
    path: string;
    validation?: any;
    validateOnBlur?: boolean;
}
declare function FormInputTextField(props: FormInputTextFieldProps): React__default.JSX.Element;

declare const _default: {
    FormInputNumericField: typeof FormInputNumericField;
    FormTextAreaField: typeof FormTextAreaField;
    FormInputTextField: typeof FormInputTextField;
};

export { _default$2 as FormAccess, FormGroup, FormList, _default$1 as controls, Form as default, _default as fields };
export type { FormAccessControl, FormAccessProps };
