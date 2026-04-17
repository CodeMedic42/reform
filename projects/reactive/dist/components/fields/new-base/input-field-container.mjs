import React from 'react';
import classnames from 'classnames';
import InputAnnotation from './input-field-annotation.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

/* eslint-disable @typescript-eslint/no-unused-vars */
function InputContainer(props) {
    const { className, children, leftAnnotation, rightAnnotation, } = props;
    return (React.createElement("div", { className: classnames('ra-input-container', className) },
        React.createElement(InputAnnotation, { annotation: leftAnnotation }),
        React.createElement("div", { className: "ra-input-content" }, children),
        React.createElement(InputAnnotation, { annotation: rightAnnotation })));
}
InputContainer.propTypes = {
    className: PropTypes.string,
    leftAnnotation: PropTypes.children,
    rightAnnotation: PropTypes.children,
    children: PropTypes.children,
};
InputContainer.defaultProps = {
    className: null,
    leftAnnotation: null,
    rightAnnotation: null,
    children: null,
};

export { InputContainer as default };
