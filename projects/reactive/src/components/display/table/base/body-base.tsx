import React from 'react';

interface BodyBaseProps {
    className?: string | null;
    children?: React.ReactNode;
}

function BodyBase(props: BodyBaseProps) {
    const { className = null, children = null } = props;

    return <tbody className={className ?? undefined}>{children}</tbody>;
}

export default BodyBase;
