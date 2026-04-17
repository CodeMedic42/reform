import React from 'react';
import classnames from 'classnames';
import FormAccess from '../support/form-access.mjs';
import { FormContextProvider } from '../support/form-context.mjs';
import { isNil } from 'lodash-es';

function FormList({ path, className, children, InnerComponent, EmptyComponent, InnerItemComponent, validateOnBlur = false, ...rest }) {
    const Component = InnerComponent || 'fieldset';
    const ItemComponent = InnerItemComponent || 'fieldset';
    return (React.createElement(FormAccess, { path: path, listenToProperty: true }, (accessControl) => {
        const { property, validateOnBlur: rootValidateOnBlur, } = accessControl;
        const buildItem = (itemProperty, index) => {
            return (React.createElement(FormContextProvider, { key: itemProperty.getUuid(), ancestorProperty: itemProperty, data: itemProperty.getData(), config: {
                    validateOnBlur: isNil(validateOnBlur) ? rootValidateOnBlur : validateOnBlur,
                } }, React.createElement(ItemComponent, {
                className: classnames('re-form-list-item', className),
                ...rest,
            }, React.Children.map(children, (child) => React.isValidElement(child) ? React.cloneElement(child) : child))));
        };
        let content = property.map(buildItem);
        if (content.length <= 0 && !isNil(EmptyComponent)) {
            content = React.createElement(EmptyComponent);
        }
        return React.createElement(Component, {
            className: classnames('re-form-list', className),
            ...rest,
        }, content);
    }));
}

export { FormList as default };
