import React from 'react';

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    minWidth: '120px',
};

const inputStyle: React.CSSProperties = {
    width: '80px',
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'monospace',
};

const unitStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
};

interface NumberInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    unit?: string;
}

export function NumberInput({ label, value, onChange, unit }: NumberInputProps) {
    return (
        <div style={wrapperStyle}>
            <span style={labelStyle}>{label}</span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={inputStyle}
            />
            {unit && <span style={unitStyle}>{unit}</span>}
        </div>
    );
}
