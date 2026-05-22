import React from 'react';
import { isNil } from 'lodash-es';

interface PanelProps {
    children?: React.ReactNode;
    _flexGrow?: number;
}

function Panel(props: PanelProps) {
    const { children, _flexGrow } = props;

    const style = !isNil(_flexGrow) ? { flexGrow: _flexGrow, flexBasis: 0 } : undefined;

    return (
        <div className="ra-panel" style={style}>
            {children}
        </div>
    );
}

export default Panel;
