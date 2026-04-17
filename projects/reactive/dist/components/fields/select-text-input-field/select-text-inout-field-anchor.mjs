import React from 'react';
import PropTypes from 'prop-types';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.mjs';
import TextInputBase from '../text-input-field/text-input-field-base.mjs';

/* eslint-disable react/jsx-props-no-spreading */
function SelectTextAnchor(props) {
    const { open, listBoxId, ...rest } = props;
    return (React.createElement(TextInputBase, { ...rest, type: "text", "aria-controls": listBoxId }));
}
SelectTextAnchor.propTypes = {
    open: PropTypes.bool.isRequired,
    listBoxId: PropTypes.string.isRequired,
};
SelectTextAnchor.defaultProps = {};
var SelectTextAnchor$1 = applyAnchorBinding(SelectTextAnchor, {
    focusSelector: '.button-anchor',
});

export { SelectTextAnchor$1 as default };
