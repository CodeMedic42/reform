import React, { memo } from 'react';
import DropDownListItem from '../../../controls/drop-down/drop-down-list-item.js';
import ListItemContent from '../../../controls/drop-down/list-item-content.js';
import buildId from '../../../../common/build-id.js';

interface SelectTextProps {
    id?: string | null;
    children?: React.ReactNode;
}

function SelectText(props: SelectTextProps): React.ReactElement {
    const {
        id = null,
        children = null,
    } = props;

    return (
        <DropDownListItem id={buildId(id, '$__custom__$')}>
            <ListItemContent className="no-options">
                {children}
            </ListItemContent>
        </DropDownListItem>
    );
}

export default memo(SelectText);
