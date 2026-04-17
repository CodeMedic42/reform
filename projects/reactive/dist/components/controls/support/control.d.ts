import React from 'react';
export type ControlProps<T extends React.ElementType = 'div'> = {
    className?: string;
    children: React.ReactNode;
    ControlComponent: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'className' | 'children'>;
declare function Control<T extends React.ElementType = 'div'>(props: ControlProps<T>): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export default Control;
//# sourceMappingURL=control.d.ts.map