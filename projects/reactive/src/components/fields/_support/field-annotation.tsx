import React from 'react';
import { isNil } from 'lodash-es';

interface FieldAnnotationProps {
    annotation?: React.ReactNode;
}

function FieldAnnotation(props: FieldAnnotationProps): React.ReactElement | null {
    const {
        annotation = null,
    } = props;

    if (isNil(annotation)) {
        return null;
    }

    return <div className="ra-field-annotation">{annotation}</div>;
}

export default FieldAnnotation;
