import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Select, { propTypes as exportPropTypes } from '../base-components/select/select.mjs';
import SelectAnchor from './select-field-anchor.mjs';

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
const SelectInput = forwardRef((props, ref) => {
    const { className, onChange, nullable, ...rest } = props;
    const handleClear = useCallback(() => {
        onChange(null);
    }, [onChange]);
    return (React.createElement(Select, { enableFiltering: true, ...rest, ref: ref, className: classnames('ra-select-input', className), anchorProps: {
            onClear: handleClear,
            nullable,
        }, Anchor: SelectAnchor, onSelect: onChange }));
});
SelectInput.propTypes = {
    ...exportPropTypes,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    nullable: PropTypes.bool,
};
SelectInput.defaultProps = {
    value: null,
    onChange: null,
    nullable: false,
};

export { SelectInput as default };
