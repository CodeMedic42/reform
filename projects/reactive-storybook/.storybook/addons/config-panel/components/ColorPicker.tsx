import React from 'react';

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    minWidth: '80px',
};

const inputStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    padding: '2px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    background: 'none',
};

const textInputStyle: React.CSSProperties = {
    width: '80px',
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'monospace',
};

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    const isTransparent = value === 'transparent';

    return (
        <div style={wrapperStyle}>
            <span style={labelStyle}>{label}</span>
            {!isTransparent && (
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                />
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={textInputStyle}
            />
        </div>
    );
}
