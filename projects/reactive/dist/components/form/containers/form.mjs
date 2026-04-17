import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import { isNil, noop } from 'lodash-es';
import { FormContextProvider } from '../support/form-context.mjs';

function perform(func, ...params) {
    return (func || noop)(...params);
}
function Form(props) {
    const { id, children, 'aria-label': ariaLabel, className, onExecute, data, validateOnBlur = false, validateOnExecute = false, } = props;
    const [executed, setExecuted] = useState(false);
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        setExecuted(true);
        if (validateOnExecute) {
            await data.validate();
        }
        await perform(onExecute);
    }, [onExecute]);
    const ancestorProperty = data.getPropertyAt('');
    if (isNil(ancestorProperty)) {
        throw new Error('Invalid property at root');
    }
    return (React.createElement(FormContextProvider, { ancestorProperty: ancestorProperty, data: data, config: {
            validateOnBlur
        } },
        React.createElement("form", { id: id, className: classnames('re-form', className, { executed }), "aria-label": ariaLabel, onSubmit: handleSubmit, noValidate: true }, children)));
}

export { Form as default };
