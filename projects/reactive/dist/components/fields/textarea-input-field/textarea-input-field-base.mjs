import React, { forwardRef, useEffect } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import InputValue from '../new-base/input-field-value.mjs';
import InputContainer from '../new-base/input-field-container.mjs';
import StringInput from '../new-base/string-input-field.mjs';
import '../../../common/prop-types.mjs';
import PropTypes from 'prop-types';

const TextareaInputBase = forwardRef((props, ref) => {
    const { id, className, value, focusOnMount, leftAnnotation, rightAnnotation, onChange, ...rest } = props;
    useEffect(() => {
        if (focusOnMount) {
            ref.current.focus();
        }
    }, []);
    return (React.createElement(InputContainer, { className: className, leftAnnotation: leftAnnotation, rightAnnotation: rightAnnotation },
        React.createElement(InputValue, { value: value, onChange: onChange }, ({ value: baseValue, onChange: baseOnChange }) => (React.createElement(StringInput, { ...rest, Component: "input", ref: ref, id: id, value: baseValue, onChange: baseOnChange, type: "text", className: classnames({
                'has-value': !isNil(baseValue),
            }), size: "1" })))));
});
TextareaInputBase.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    focusOnMount: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.string,
    leftAnnotation: PropTypes.children,
    rightAnnotation: PropTypes.children,
};
TextareaInputBase.defaultProps = {
    id: null,
    className: null,
    focusOnMount: false,
    onChange: null,
    value: null,
    leftAnnotation: null,
    rightAnnotation: null,
};
