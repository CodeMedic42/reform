import React from 'react';
import classnames from 'classnames';
import FormField from './support/form-field.mjs';
import TextInputField from '../../fields/text-input-field/text-input-field.mjs';

function FormInputTextField(props) {
    const { path, className, validateOnBlur, ...rest } = props;
    return (React.createElement(FormField, { ...rest, path: path, ControlComponent: TextInputField, className: classnames('re-form-input-text-field', className), validateOnBlur: validateOnBlur, nativeAttributes: ['required'] }));
}

export { FormInputTextField as default };
