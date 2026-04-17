import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil, clone, pullAt } from 'lodash-es';
import Select, { propTypes as exportPropTypes, defaultProps as exportDefaultProps } from '../base-components/select/select.mjs';
import MultiSelectAnchor from './multi-select-input-field-anchor.mjs';

const MultiSelectInput = forwardRef((props, ref) => {
    const { className, expandable, onChange, value, nullable, ...rest } = props;
    const handleClear = useCallback(() => {
        onChange(null);
    }, [onChange]);
    const handleClearIndex = useCallback(({ index }) => {
        if (isNil(onChange)) {
            return;
        }
        let newValue = clone(value);
        pullAt(newValue, [index]);
        if (newValue.length <= 0) {
            newValue = null;
        }
        onChange(newValue);
    }, [value, onChange]);
    return (React.createElement(Select, { enableFiltering: true, ...rest, ref: ref, className: classnames('ra-select-input', 'ra-multi-select', className, {
            expandable,
        }), Anchor: MultiSelectAnchor, anchorProps: {
            onClear: handleClear,
            onClearIndex: handleClearIndex,
            nullable,
        }, useFilter: true, isMultiSelect: true, onSelect: onChange }));
});
MultiSelectInput.propTypes = {
    ...exportPropTypes,
    value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    expandable: PropTypes.bool,
    onChange: PropTypes.func,
    nullable: PropTypes.bool,
};
MultiSelectInput.defaultProps = {
    ...exportDefaultProps,
    value: null,
    expandable: false,
    onChange: null,
    nullable: false,
};

export { MultiSelectInput as default };
