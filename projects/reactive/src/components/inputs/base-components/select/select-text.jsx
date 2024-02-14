import React, { memo } from 'react';
import PropTypes from 'prop-types';
import DropDownListItem from '../../../controls/drop-down/drop-down-list-item';
import ListItemContent from '../../../controls/drop-down/list-item-content';
import buildId from '../../../../common/build-id';

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
