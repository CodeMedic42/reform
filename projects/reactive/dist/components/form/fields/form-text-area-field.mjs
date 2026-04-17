import React from 'react';
import classnames from 'classnames';
import FormField from './support/form-field.mjs';
import TextareaInputField from '../../fields/textarea-input-field/textarea-input-field.mjs';

function FormTextAreaField(props) {
    const { path, className, validateOnBlur, ...rest } = props;
    return (React.createElement(FormField, { ...rest, path: path, ControlComponent: TextareaInputField, className: classnames('re-form-text-area-field', className), validateOnBlur: validateOnBlur, nativeAttributes: ['required'] }));
}

export { FormTextAreaField as default };
