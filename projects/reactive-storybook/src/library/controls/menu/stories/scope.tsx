import React, { ReactNode, CSSProperties } from 'react';

interface ScopeProps {
    title?: string;
    fillViewport?: boolean;
    children?: ReactNode;
}

const baseStyle: CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
};

const fillStyle: CSSProperties = {
    padding: '16px',
    minHeight: '100vh',
    boxSizing: 'border-box',
};

function Scope({ title, fillViewport = false, children }: ScopeProps) {
    return (
        <section style={fillViewport ? fillStyle : baseStyle}>
            {title != null ? (
                <h4 style={{ margin: '0 0 12px 0' }}>{title}</h4>
            ) : null}
            {children}
        </section>
    );
}

export default Scope;
