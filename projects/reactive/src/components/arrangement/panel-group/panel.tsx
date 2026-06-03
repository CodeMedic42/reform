import React from 'react';
import { isNil } from 'lodash-es';

interface PanelProps {
    children?: React.ReactNode;
    flexGrow?: number;
}

function Panel(props: PanelProps) {
    const { children, flexGrow } = props;

    const style = !isNil(flexGrow) ? { flexGrow, flexBasis: 0 } : undefined;

    return (
        <div className="ra-panel" style={style}>
            {children}
        </div>
    );
}

export default Panel;
