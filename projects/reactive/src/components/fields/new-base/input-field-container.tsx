/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import classnames from 'classnames';
import InputAnnotation from './input-field-annotation.js';

interface InputContainerProps {
    className?: string | null;
    leftAnnotation?: React.ReactNode;
    rightAnnotation?: React.ReactNode;
    children?: React.ReactNode;
}

function InputContainer(props: InputContainerProps): React.ReactElement {
    const {
        className = null,
        children = null,
        leftAnnotation = null,
        rightAnnotation = null,
    } = props;

    return (
        <div
            className={classnames('ra-input-container', className)}
        >
            <InputAnnotation annotation={leftAnnotation} />
            <div className="ra-input-content">
                {children}
            </div>
            <InputAnnotation annotation={rightAnnotation} />
        </div>
    );
}

export default InputContainer;
