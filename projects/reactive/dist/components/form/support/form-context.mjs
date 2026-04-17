import React from 'react';
import { useRefCallback } from '@reformjs/reactive-hooks';
import { isNil } from 'lodash-es';

const formContext = React.createContext(null);
function ApplyFormPropertyConsumer(Component) {
    return function PropertyConsumer(props) {
        return (React.createElement(formContext.Consumer, null, (formMeta) => {
            if (isNil(formMeta)) {
                throw new Error('Form meta is nil');
            }
            const { data, ancestorProperty, } = formMeta;
            const { path, ...rest } = props;
            const property = ancestorProperty.getPropertyAt(!isNil(path) ? path : '');
            return React.createElement(Component, {
                key: path,
                property,
                data,
                validateOnBlur: formMeta.config.validateOnBlur,
                ...rest,
            });
        }));
    };
}
function FormContextProvider(props) {
    const { children, ancestorProperty, data, config, } = props;
    const contextRef = useRefCallback(() => ({
        ancestorProperty,
        data,
        config,
    }));
    return React.createElement(formContext.Provider, { value: contextRef.current }, children);
}

export { ApplyFormPropertyConsumer, FormContextProvider };
