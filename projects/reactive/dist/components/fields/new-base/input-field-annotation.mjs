import React from 'react';
import { isNil } from 'lodash-es';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

function InputAnnotation(props) {
    const { annotation, } = props;
    if (isNil(annotation)) {
        return null;
    }
    return React.createElement("div", { className: "ra-input-annotation" }, annotation);
}
InputAnnotation.propTypes = {
    annotation: PropTypes.children,
};
InputAnnotation.defaultProps = {
    annotation: null,
};

export { InputAnnotation as default };
