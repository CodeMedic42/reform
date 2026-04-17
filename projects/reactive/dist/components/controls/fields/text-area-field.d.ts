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
declare function InputTextAreaField(props: InputTextFieldProps): React.JSX.Element;
export default InputTextAreaField;
//# sourceMappingURL=text-area-field.d.ts.map