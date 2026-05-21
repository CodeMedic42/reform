import React from 'react';

interface HeadBaseProps {
    className?: string | null;
    children?: React.ReactNode;
}

function HeadBase(props: HeadBaseProps) {
    const { className = null, children = null } = props;

    return <thead className={className ?? undefined}>{children}</thead>;
}

export default HeadBase;
