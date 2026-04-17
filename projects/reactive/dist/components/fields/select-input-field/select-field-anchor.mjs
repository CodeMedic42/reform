import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import IconBox from '../../display/icon-box/icon-box.mjs';
import '../../display/typography/typography.mjs';
import Text from '../../display/typography/text.mjs';
import '../../display/typography/heading.mjs';
import '../../display/typography/sub-heading.mjs';
import '../../display/typography/caption.mjs';
import '../../display/typography/paragraph.mjs';
import '../../display/typography/overline.mjs';
import IconButton from '../../display/icon-button/icon-button.mjs';
import applyAnchorBinding from '../../controls/drop-down/anchor-binding.mjs';
import changeSize from '../../../util/change-size.mjs';

/* eslint-disable react/jsx-props-no-spreading */
function prevent(event) {
    event.preventDefault();
}
function SelectAnchor(props) {
    const { id, disabled, 'aria-labelledby': labelledBy, 'aria-describedby': describedBy, title, open, value, nullable, size, placeholder, 'aria-label': ariaLabel, listBoxId, onClear, } = props;
    const handleClear = useCallback((event) => {
        if (isNil(onClear)) {
            return;
        }
        prevent(event);
        onClear(event);
    }, [onClear]);
    let selectedText = value;
    if (isNil(selectedText) || selectedText.length <= 0) {
        if (!isNil(placeholder) && placeholder.length > 0) {
            selectedText = placeholder;
        }
        else {
            selectedText = '';
        }
    }
    const clearButton = (isNil(nullable) || nullable) && !isNil(value) && value.length > 0 ? (React.createElement(IconButton, { className: "clear", tabIndex: "-1", icon: faXmark, onClick: handleClear, onMouseDown: prevent, size: changeSize(size, 1), disabled: disabled })) : null;
    const handleKeyDown = useCallback((event) => {
        if (event.which === 8 // backspace
            || event.which === 46 // delete
        ) {
            onClear();
        }
    }, [onClear]);
    return (React.createElement("div", { className: classnames('ra-select-anchor', 'ra-single-select-anchor', `size-${size}`) },
        React.createElement("div", { className: classnames('ra-anchor-boundary', {
                focus: open,
            }) },
            React.createElement("button", { id: id, className: classnames('anchor-control', 'button-anchor', {
                    nullable,
                    focus: open,
                    'has-value': !isNil(value) && value.length > 0,
                }), role: "combobox", "aria-controls": listBoxId, "aria-expanded": open, "aria-haspopup": "listbox", type: "button", "aria-describedby": describedBy, "aria-labelledby": labelledBy, title: title, disabled: disabled, "aria-label": ariaLabel, value: !isNil(value) && value.length > 0 ? value : null, onKeyDown: handleKeyDown }),
            React.createElement("div", { className: "anchor-content" },
                React.createElement(Text, { className: "anchor-selected-item", size: size === 'lg' ? 'xl' : 'lg' }, selectedText),
                React.createElement(IconBox, { className: "arrow", icon: open ? faAngleUp : faAngleDown, size: changeSize(size, 1) }),
                clearButton))));
}
SelectAnchor.propTypes = {
    id: PropTypes.string,
    disabled: PropTypes.bool,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    nullable: PropTypes.bool,
    placeholder: PropTypes.string,
    'aria-label': PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    onClear: PropTypes.func,
    listBoxId: PropTypes.string.isRequired,
};
SelectAnchor.defaultProps = {
    size: null,
    id: null,
    disabled: false,
    'aria-labelledby': null,
    'aria-describedby': null,
    title: null,
    value: null,
    placeholder: null,
    'aria-label': null,
    onClear: null,
    nullable: true,
};
var SelectAnchor$1 = applyAnchorBinding(SelectAnchor, {
    focusSelector: '.button-anchor',
});

export { SelectAnchor$1 as default };
