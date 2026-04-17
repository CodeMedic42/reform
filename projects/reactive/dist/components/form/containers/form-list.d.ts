import React from 'react';
type FormListProps<C extends React.ElementType> = {
    InnerComponent?: C;
    EmptyComponent?: React.ElementType;
    InnerItemComponent?: React.ElementType;
    path: string;
    className?: string;
    children: React.ReactNode;
    validateOnBlur?: boolean;
} & Omit<React.ComponentPropsWithoutRef<C>, 'className' | 'children'>;
declare function FormList<C extends React.ElementType = 'fieldset'>({ path, className, children, InnerComponent, EmptyComponent, InnerItemComponent, validateOnBlur, ...rest }: FormListProps<C>): React.JSX.Element;
export default FormList;
//# sourceMappingURL=form-list.d.ts.map