import React from 'react';
interface InputTextFieldProps {
    className?: string;
    value: string;
    onChange?: (value: string | null) => void;
    messages?: string[];
    attributes?: {
        [key: string]: any;
    };
}
declare function InputTextField(props: InputTextFieldProps): React.JSX.Element;
export default InputTextField;
//# sourceMappingURL=input-text-field.d.ts.map