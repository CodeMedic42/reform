import React from 'react';
import classnames from 'classnames';

export interface TabBottomProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
}

function TabBottom(props: TabBottomProps): React.ReactElement {
    const {
        id,
        className,
        children,
    } = props;

    return (
        <div id={id ?? undefined} className={classnames('ra-tab-bottom', className)}>
            {children}
        </div>
    );
}

export default TabBottom;
