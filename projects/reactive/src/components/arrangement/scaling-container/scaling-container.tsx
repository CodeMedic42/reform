import React from 'react';
import classnames from 'classnames';

export interface ScalingContainerProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
}

function ScalingContainer(props: ScalingContainerProps): React.ReactElement {
    const {
        id,
        className,
        children,
    } = props;

    return (
        <div
            id={id ?? undefined}
            className={classnames('ra-scaling-container', className)}
        >
            <div className="ra-scaling-content">
                {children}
            </div>
        </div>
    );
}

export default ScalingContainer;
