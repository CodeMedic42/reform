import React from "react";
interface FormControlProps {
    path: string;
    className?: string;
    ControlComponent: React.ComponentType<any>;
    validateOnBlur?: boolean;
    nativeAttributes: string[];
    onBlur?: Function;
}
declare function FormField(props: FormControlProps): React.JSX.Element;
export default FormField;
//# sourceMappingURL=form-field.d.ts.map