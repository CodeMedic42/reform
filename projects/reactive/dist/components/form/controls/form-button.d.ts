import React from "react";
import { Property, Data } from "@reformjs/reactive-data";
interface FormButtonProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> {
    path?: string;
    className?: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>, form: {
        property: Property;
        data: Data;
    }) => void;
}
declare function FormButton(props: FormButtonProps): React.JSX.Element;
export default FormButton;
//# sourceMappingURL=form-button.d.ts.map