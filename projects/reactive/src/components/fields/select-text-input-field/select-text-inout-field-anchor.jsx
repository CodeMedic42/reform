/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.jsx';
import TextInputBase from '../text-input-field/text-input-field-base.jsx';

function SelectTextAnchor(props) {
    const {
        open,
        listBoxId,
        ...rest
    } = props;

    return (
        <TextInputBase
            {...rest}
            type="text"
            aria-controls={listBoxId}
        />
    );
}

SelectTextAnchor.propTypes = {
    open: PropTypes.bool.isRequired,
    listBoxId: PropTypes.string.isRequired,
};

SelectTextAnchor.defaultProps = {};

export default applyAnchorBinding(SelectTextAnchor, {
    focusSelector: '.button-anchor',
});
