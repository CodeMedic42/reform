import React from 'react';
import isNil from 'lodash/isNil';
import PropTypes from '../../../common/prop-types';

function InputAnnotation(props) {
    const {
        annotation,
    } = props;

    if (isNil(annotation)) {
        return null;
    }

    return <div className="ra-input-annotation">{annotation}</div>;
}

InputAnnotation.propTypes = {
    annotation: PropTypes.children,
};

InputAnnotation.defaultProps = {
    annotation: null,
};

export default InputAnnotation;
