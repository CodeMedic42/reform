import React, { useState } from 'react';

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e6e6e6',
};

const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#EEE',
};

const buttonStyle: React.CSSProperties = {
    padding: '0 6px',
    fontSize: '14px',
    lineHeight: 1,
    cursor: 'pointer',
    borderRadius: '3px',
    border: '1px solid #029cfd',
    background: 'transparent',
    color: '#029cfd',
    userSelect: 'none',
};

const descriptionWrapperStyle = (open: boolean): React.CSSProperties => ({
    overflow: 'hidden',
    maxHeight: open ? '400px' : '0',
    opacity: open ? 1 : 0,
    transition: 'max-height 200ms ease-in-out, opacity 200ms ease-in-out',
});

const descriptionTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#ccc',
    lineHeight: 1.5,
    padding: '8px 0 12px',
};

interface SectionDescriptionProps {
    title: string;
    description: string;
}

export function SectionDescription({ title, description }: SectionDescriptionProps) {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={headerStyle}>
                <span style={titleStyle}>{title}</span>
                <button
                    type="button"
                    style={buttonStyle}
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label={open ? 'Hide description' : 'Show description'}
                    aria-expanded={open}
                >
                    {open ? 'ⓧ' : 'ⓘ'}
                </button>
            </div>
            <div style={descriptionWrapperStyle(open)} aria-hidden={!open}>
                <p style={descriptionTextStyle}>{description}</p>
            </div>
        </div>
    );
}
