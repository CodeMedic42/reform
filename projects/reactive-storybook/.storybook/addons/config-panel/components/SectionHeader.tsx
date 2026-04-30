import React, { useState } from 'react';

const headerStyle = (level: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: level === 0 ? '8px 0' : '4px 0',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: level === 0 ? '1px solid #e6e6e6' : 'none',
});

const titleStyle = (level: number): React.CSSProperties => ({
    fontSize: level === 0 ? '14px' : '12px',
    fontWeight: 600,
    color: '#EEE',
});

const arrowStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#999',
};

const contentStyle: React.CSSProperties = {
    padding: '8px 0 8px 16px',
};

const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
};

const removeButtonStyle: React.CSSProperties = {
    padding: '2px 6px',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '3px',
    border: '1px solid #dc3545',
    background: 'transparent',
    color: '#dc3545',
};

interface SectionHeaderProps {
    title: string;
    level?: number;
    defaultOpen?: boolean;
    onRemove?: () => void;
    children: React.ReactNode;
}

export function SectionHeader({ title, level = 0, defaultOpen = false, onRemove, children }: SectionHeaderProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <div style={headerStyle(level)} onClick={() => setOpen(!open)}>
                <span style={titleStyle(level)}>
                    <span style={arrowStyle}>{open ? '▼' : '▶'} </span>
                    {title}
                </span>
                <div style={actionsStyle}>
                    {onRemove && (
                        <button
                            style={removeButtonStyle}
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
            {open && <div style={contentStyle}>{children}</div>}
        </div>
    );
}
