import React from 'react';
import classNames from 'classnames';

type PanelGroupDirection = 'horizontal' | 'vertical';

interface PanelDividerProps {
    direction?: PanelGroupDirection;
    dividerIndex: number;
    onResizeStart: (e: React.PointerEvent<HTMLDivElement>, dividerIndex: number) => void;
}

function PanelDivider(props: PanelDividerProps) {
    const { direction = 'horizontal', dividerIndex, onResizeStart } = props;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        onResizeStart(e, dividerIndex);
    };

    return (
        <div
            className={classNames('ra-panel-divider', `ra-panel-divider--${direction}`)}
            onPointerDown={handlePointerDown}
            role="separator"
            aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        />
    );
}

export default PanelDivider;
