import React from 'react';
interface InputNumericFieldProps {
    className?: string;
    value: string;
    onChange?: (value: number | null) => void;
    messages?: string[];
    attributes?: {
        [key: string]: any;
    };
}
declare function InputNumericField(props: InputNumericFieldProps): React.JSX.Element;
export default InputNumericField;
//# sourceMappingURL=input-numeric-field.d.ts.map