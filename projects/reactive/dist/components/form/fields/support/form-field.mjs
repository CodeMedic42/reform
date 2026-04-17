import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import FormAccess from '../../support/form-access.mjs';
import { reduce, isNil, findIndex } from 'lodash-es';

function FormField(props) {
    const { path, className, ControlComponent, validateOnBlur, nativeAttributes, onBlur, ...rest } = props;
    return (React.createElement(FormAccess, { path: path, listenToProperty: true }, (accessControl) => {
        const { value, valid, setValue, validation, property, validateOnBlur: rootValidateOnBlur, } = accessControl;
        const messages = [];
        const validationAttributes = reduce(validation, (acc, rulesStatus, key) => {
            const attributeValue = !isNil(rulesStatus.attribute)
                ? rulesStatus.attribute
                : rulesStatus.enabled;
            if (findIndex(nativeAttributes, (v) => v === key) >= 0) {
                acc[key] = attributeValue;
            }
            else {
                acc[`data-${key}`] = attributeValue;
            }
            if (!isNil(rulesStatus.message)) {
                messages.push(rulesStatus.message);
            }
            return acc;
        }, {});
        const [touched, setTouched] = useState(false);
        const handleBlur = useCallback((...args) => {
            if (isNil(validateOnBlur) ? rootValidateOnBlur : validateOnBlur) {
                property.validate();
            }
            setTouched(true);
            if (!isNil(onBlur)) {
                onBlur(...args);
            }
        }, [validateOnBlur, rootValidateOnBlur]);
        const innerClassName = classnames('re-form-field', className, {
            valid,
            invalid: !valid,
            touched,
        });
        return React.createElement(ControlComponent, {
            ...rest,
            className: innerClassName,
            value,
            onChange: setValue,
            onBlur: handleBlur,
            messages,
            attributes: validationAttributes,
        });
    }));
}

export { FormField as default };
