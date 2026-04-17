import React from 'react';
type FormGroupProps<C extends React.ElementType> = {
    InnerComponent?: C;
    path: string;
    className?: string;
    children: React.ReactNode;
    validateOnBlur?: boolean;
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'>;
declare function FormGroup<C extends React.ElementType = 'fieldset'>({ InnerComponent, path, className, children, validateOnBlur, ...rest }: FormGroupProps<C>): React.JSX.Element;
export default FormGroup;
//# sourceMappingURL=form-group.d.ts.map