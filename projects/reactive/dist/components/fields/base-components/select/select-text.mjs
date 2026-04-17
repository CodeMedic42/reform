import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DropDownListItem from '../../../controls/drop-down/drop-down-list-item.mjs';
import ListItemContent from '../../../controls/drop-down/list-item-content.mjs';
import buildId from '../../../../common/build-id.mjs';

function SelectText(props) {
    const { id, children, } = props;
    return (React.createElement(DropDownListItem, { id: buildId(id, '$__custom__$') },
        React.createElement(ListItemContent, { className: "no-options" }, children)));
}
SelectText.propTypes = {
    id: PropTypes.string,
    children: PropTypes.string,
};
SelectText.defaultProps = {
    id: null,
    children: null,
};
var SelectText$1 = memo(SelectText);

export { SelectText$1 as default };
