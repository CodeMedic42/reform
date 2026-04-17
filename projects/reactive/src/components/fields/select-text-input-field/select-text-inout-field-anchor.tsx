/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.jsx';
import TextInputBase from '../text-input-field/text-input-field-base.js';

interface SelectTextAnchorProps {
    open: boolean;
    listBoxId: string;
    [key: string]: unknown;
}

function SelectTextAnchor(props: SelectTextAnchorProps): React.ReactElement {
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

export default applyAnchorBinding(SelectTextAnchor, {
    focusSelector: '.button-anchor',
});
