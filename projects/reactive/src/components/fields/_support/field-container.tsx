/* @typescript-eslint/no-unused-vars */
import React from 'react';
import classnames from 'classnames';
import FieldAnnotation from './field-annotation.js';

interface FieldContainerProps {
    className?: string | null;
    leftAnnotation?: React.ReactNode;
    rightAnnotation?: React.ReactNode;
    children?: React.ReactNode;
}

function FieldContainer(props: FieldContainerProps): React.ReactElement {
    const {
        className = null,
        children = null,
        leftAnnotation = null,
        rightAnnotation = null,
    } = props;

    return (
        <div
            className={classnames('ra-field-container', className)}
        >
            <FieldAnnotation annotation={leftAnnotation} />
            <div className="ra-field-content">
                {children}
            </div>
            <FieldAnnotation annotation={rightAnnotation} />
        </div>
    );
}

export default FieldContainer;
