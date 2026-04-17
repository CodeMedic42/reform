import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Select, { propTypes as exportPropTypes, defaultProps as exportDefaultProps } from '../base-components/select/select.mjs';
import SelectTextAnchor from './select-text-inout-field-anchor.mjs';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
const SelectTextInput = forwardRef((props, ref) => {
    const { className, onChange, ...rest } = props;
    return (React.createElement(Select, { ...rest, ref: ref, className: classnames('ra-select-text-input', className), Anchor: SelectTextAnchor, anchorProps: {
            onChange,
        } }));
});
SelectTextInput.propTypes = {
    ...exportPropTypes,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};
SelectTextInput.defaultProps = {
    ...exportDefaultProps,
    value: null,
    onChange: null,
};

export { SelectTextInput as default };
