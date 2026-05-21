import React from 'react';

interface HeaderCellBaseProps {
    children?: React.ReactNode;
}

function HeaderCellBase(props: HeaderCellBaseProps) {
    const { children = null } = props;

    return <div className="ra-header-cell no-select">{children}</div>;
}

export default HeaderCellBase;
