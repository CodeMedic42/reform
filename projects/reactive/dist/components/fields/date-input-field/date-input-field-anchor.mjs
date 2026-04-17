import React from 'react';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.mjs';
import DateInputBase from '../new-base/date/date-input-base.mjs';
import '../../../common/prop-types.mjs';
import buildId from '../../../common/build-id.mjs';
import InputContainer from '../new-base/input-field-container.mjs';
import PropTypes from 'prop-types';

function DateInputAnchor(props) {
    const { id, title, 'aria-labelledby': ariaLabeledBy, 'aria-describedby': ariaDescribedBy, required, disabled, name, size, 'aria-label': ariaLabel, value, onChange, leftAnnotation, rightAnnotation,
    // ...rest
     } = props;
    // const date = !isNil(value) ? format(value, 'MM / dd / yyyy') : null;
    return (React.createElement(InputContainer, { leftAnnotation: leftAnnotation, rightAnnotation: rightAnnotation },
        React.createElement(DateInputBase, { id: buildId(id, 'from'), title: buildId(title, 'from'), name: buildId(name, 'from'), size: size, value: value, onChange: onChange, required: required, disabled: disabled, "aria-labelledby": ariaLabeledBy, "aria-describedby": ariaDescribedBy, "aria-label": buildId(ariaLabel, 'from') })));
}
DateInputAnchor.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    size: PropTypes.string,
    'aria-label': PropTypes.string,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    leftAnnotation: PropTypes.children,
    rightAnnotation: PropTypes.children,
};
DateInputAnchor.defaultProps = {
    id: null,
    title: null,
    'aria-labelledby': null,
    'aria-describedby': null,
    'aria-label': null,
    required: false,
    disabled: false,
    name: null,
    size: null,
    value: null,
    onChange: null,
    leftAnnotation: null,
    rightAnnotation: null,
};
var DateInputAnchor$1 = applyAnchorBinding(DateInputAnchor, {
    focusSelector: '.input-container input',
});

export { DateInputAnchor$1 as default };
