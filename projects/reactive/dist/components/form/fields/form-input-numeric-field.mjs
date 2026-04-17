import React from 'react';
import classnames from 'classnames';
import FormField from './support/form-field.mjs';
import NumericInputField from '../../fields/numeric-input-field/numeric-input-field.mjs';

function FormInputNumericField(props) {
    const { path, className, validateOnBlur, ...rest } = props;
    return (React.createElement(FormField, { ...rest, path: path, ControlComponent: NumericInputField, className: classnames('re-form-input-numeric-field', className), validateOnBlur: validateOnBlur, nativeAttributes: ['required'] }));
}

export { FormInputNumericField as default };
