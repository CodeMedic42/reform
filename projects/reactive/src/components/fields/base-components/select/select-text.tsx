import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DropDownListItem from '../../../controls/drop-down/drop-down-list-item.jsx';
import ListItemContent from '../../../controls/drop-down/list-item-content.jsx';
import buildId from '../../../../common/build-id.js';

function SelectText(props) {
    const {
        id,
        children,
    } = props;

    return (
        <DropDownListItem id={buildId(id, '$__custom__$')}>
            <ListItemContent className="no-options">
                {children}
            </ListItemContent>
        </DropDownListItem>
    );
}

SelectText.propTypes = {
    id: PropTypes.string,
    children: PropTypes.string,
};

SelectText.defaultProps = {
    id: null,
    children: null,
};

export default memo(SelectText);
