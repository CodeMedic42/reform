import React from 'react';
import classnames from 'classnames';
import Button from '../../controls/button/button.mjs';
import { isNil } from 'lodash-es';
import FormAccess from '../support/form-access.mjs';

function FormButton(props) {
    const { path, children, onClick, className, ...rest } = props;
    return (React.createElement(FormAccess, { path: path }, (accessControl) => {
        const { data, property, } = accessControl;
        const handleOnClick = !isNil(onClick)
            ? (event) => onClick(event, { property, data })
            : undefined;
        const innerClassName = classnames('re-form-button', className);
        return (React.createElement(Button, { className: innerClassName, onClick: handleOnClick, ...rest }, children));
    }));
}

export { FormButton as default };
