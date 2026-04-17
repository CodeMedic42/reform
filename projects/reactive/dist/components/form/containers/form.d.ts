import React from 'react';
import { Data } from '@reformjs/reactive-data';
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
declare function Form(props: FormProps): React.JSX.Element;
export default Form;
//# sourceMappingURL=form.d.ts.map