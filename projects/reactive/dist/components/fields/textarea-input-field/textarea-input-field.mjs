import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import classnames from 'classnames';
import InputFieldLabel from '../new-base/input-field-label.mjs';
import '../../../common/prop-types.mjs';
import './textarea-input-field-base.mjs';
import PropTypes from 'prop-types';

const TextareaInputField = forwardRef((props, ref) => {
    const { className, id, label, messages, failure, 'aria-labelledby': ariaLabelledby, 'aria-describedby': ariaDescribedby, hidden, disabled, variant, ...rest } = props;
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
        getInputRef: () => inputRef,
        focus: () => {
            if (disabled) {
                return;
            }
            inputRef.current.focus();
        },
    }), [disabled]);
    return (React.createElement(InputFieldLabel, { className: classnames('ra-text-input', className), id: id, label: label, messages: messages, failure: failure, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, hidden: hidden, disabled: disabled, variant: variant }, ({ describedBy, labelledBy, inputId }) => (React.createElement(TextTextareaInputFieldBase, { ...rest, type: "text", id: inputId, "aria-labelledby": labelledBy, "aria-describedby": describedBy, disabled: disabled }))));
});
TextareaInputField.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    // variant: Represents Size and other none coloring features.
    variant: PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    hidden: PropTypes.bool,
    failure: PropTypes.bool,
    messages: PropTypes.inputMessages,
};
TextareaInputField.defaultProps = {
    id: null,
    className: null,
    label: null,
    disabled: false,
    variant: null,
    'aria-labelledby': null,
    'aria-describedby': null,
    hidden: false,
    failure: false,
    messages: null,
};

export { TextareaInputField as default };
