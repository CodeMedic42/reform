import React, { useCallback } from 'react';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.mjs';
import DateInputBase from '../new-base/date/date-input-base.mjs';
import '../../../common/prop-types.mjs';
import buildId from '../../../common/build-id.mjs';
import InputContainer from '../new-base/input-field-container.mjs';
import PropTypes from 'prop-types';

function DateRangeInputAnchor(props) {
    const { id, title, 
    // 'aria-labelledby': ariaLabeledBy,
    // 'aria-describedby': ariaDescribedBy,
    // required,
    // disabled,
    name, 
    // size,
    'aria-label': ariaLabel, fromDate, toDate, onChange, onFromFocus, onToFocus, leftAnnotation, rightAnnotation, ...rest } = props;
    const handleFromChange = useCallback((newFrom) => {
        onChange({
            from: newFrom,
            to: toDate,
        });
    }, [onChange, toDate]);
    const handleToChange = useCallback((newTo) => {
        onChange({
            from: fromDate,
            to: newTo,
        });
    }, [onChange, fromDate]);
    return (React.createElement(InputContainer, { className: "ra-date-range-inputs", leftAnnotation: leftAnnotation, rightAnnotation: rightAnnotation },
        React.createElement(DateInputBase, { ...rest, id: buildId(id, 'from'), className: "from-date", title: buildId(title, 'from'), name: buildId(name, 'from'), 
            // size={size}
            value: fromDate, onChange: handleFromChange, "aria-label": buildId(ariaLabel, 'from'), onFocus: onFromFocus }),
        React.createElement(DateInputBase, { ...rest, id: buildId(id, 'to'), className: "to-date", title: buildId(title, 'to'), name: buildId(name, 'to'), 
            // size={size}
            value: toDate, onChange: handleToChange, "aria-label": buildId(ariaLabel, 'to'), onFocus: onToFocus })));
}
DateRangeInputAnchor.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    size: PropTypes.string,
    'aria-label': PropTypes.string,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    onFromFocus: PropTypes.func.isRequired,
    onToFocus: PropTypes.func.isRequired,
    leftAnnotation: PropTypes.children,
    rightAnnotation: PropTypes.children,
};
DateRangeInputAnchor.defaultProps = {
    id: null,
    title: null,
    'aria-labelledby': null,
    'aria-describedby': null,
    'aria-label': null,
    required: false,
    disabled: false,
    name: null,
    size: null,
    fromDate: null,
    toDate: null,
    onChange: null,
    leftAnnotation: null,
    rightAnnotation: null,
};
var DateRangeInputAnchor$1 = applyAnchorBinding(DateRangeInputAnchor, {
    focusSelector: '.input-container input',
});

export { DateRangeInputAnchor$1 as default };
