import React from 'react';
import classnames from 'classnames';
import FormAccess from '../support/form-access.mjs';
import { FormContextProvider } from '../support/form-context.mjs';
import { isNil } from 'lodash-es';

function FormGroup({ InnerComponent, path, className, children, validateOnBlur, ...rest }) {
    const Component = InnerComponent || 'fieldset';
    return (React.createElement(FormAccess, { path: path, listenToProperty: true }, (accessControl) => {
        const { property, validateOnBlur: rootValidateOnBlur, } = accessControl;
        return React.createElement(Component, {
            className: classnames('re-form-group', className),
            ...rest,
        }, (React.createElement(FormContextProvider, { ancestorProperty: property, data: property.getData(), config: {
                validateOnBlur: isNil(validateOnBlur) ? rootValidateOnBlur : validateOnBlur,
            } }, children)));
    }));
}

export { FormGroup as default };
