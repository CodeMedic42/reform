import React from 'react';
import { isNil } from 'lodash-es';

interface InputAnnotationProps {
    annotation?: React.ReactNode;
}

function InputAnnotation(props: InputAnnotationProps): React.ReactElement | null {
    const {
        annotation = null,
    } = props;

    if (isNil(annotation)) {
        return null;
    }

    return <div className="ra-input-annotation">{annotation}</div>;
}

export default InputAnnotation;
