import React from 'react';

interface ScopeProps {
    title: string;
    children?: React.ReactNode;
    specimenViewStyle?: React.CSSProperties;
    minWidth?: number;
}

/** Lightweight section wrapper for showcase stories that contain multiple
 *  variants. Replaces the legacy `Scope` component from the original storybook. */
export default function Scope(props: ScopeProps) {
    const { title, children, specimenViewStyle, minWidth } = props;

    return (
        <section style={{ marginBottom: '32px', minWidth }}>
            <h4 style={{ margin: '0 0 12px', fontFamily: 'system-ui, sans-serif' }}>
                {title}
            </h4>
            <div style={specimenViewStyle}>{children}</div>
        </section>
    );
}
