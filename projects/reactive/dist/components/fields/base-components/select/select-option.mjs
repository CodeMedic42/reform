import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DropDownListItem from '../../../controls/drop-down/drop-down-list-item.mjs';
import ListItemButton from '../../../controls/drop-down/list-item-button.mjs';
import { schemeColorPropType } from '../../../../common/color-list.mjs';

function SelectOption(props) {
    const { id, targeted, selected, borderBottom, color, 'aria-label': ariaLabel, children, onClick, optionValue, disabled, } = props;
    const handleOnClick = useCallback(() => {
        onClick(optionValue);
    }, [onClick, optionValue]);
    return (React.createElement(DropDownListItem, { id: id, className: classnames({
            disabled,
        }), targeted: targeted, borderBottom: borderBottom, color: color, "aria-label": ariaLabel, selected: selected, disabled: disabled },
        React.createElement(ListItemButton, { onClick: handleOnClick, tabIndex: "-1", disabled: disabled }, children)));
}
SelectOption.propTypes = {
    id: PropTypes.string,
    targeted: PropTypes.bool,
    selected: PropTypes.bool,
    borderBottom: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    optionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: schemeColorPropType,
    'aria-label': PropTypes.string,
    disabled: PropTypes.bool,
};
SelectOption.defaultProps = {
    id: null,
    targeted: false,
    selected: false,
    borderBottom: false,
    disabled: false,
    children: null,
    onClick: null,
    color: null,
    'aria-label': null,
};
var SelectOption$1 = memo(SelectOption);

export { SelectOption$1 as default };
