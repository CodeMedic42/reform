import React from 'react';
import type { PaletteRef, PaletteShade } from '../types';
import { resolvePaletteRef, type PaletteMap } from '../util/resolve-palette-ref';

const SHADES: PaletteShade[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];

const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    minWidth: '100px',
};

const swatchStyle = (hex: string): React.CSSProperties => ({
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: hex === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px' : hex,
});

const selectStyle: React.CSSProperties = {
    padding: '4px 6px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fff',
};

const transparentToggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#666',
};

interface PaletteRefPickerProps {
    label: string;
    value: PaletteRef;
    palettes: PaletteMap;
    onChange: (value: PaletteRef) => void;
}

export function PaletteRefPicker({ label, value, palettes, onChange }: PaletteRefPickerProps) {
    const isTransparent = value === 'transparent';
    const paletteNames = Object.keys(palettes);
    const selectedPalette = isTransparent ? '' : value.palette;
    const selectedShade: PaletteShade = isTransparent ? 500 : value.shade;
    const resolved = resolvePaletteRef(value, palettes);

    const handleToggleTransparent = (checked: boolean) => {
        if (checked) {
            onChange('transparent');
        } else {
            const fallbackPalette = paletteNames[0] ?? 'gray';
            onChange({ palette: fallbackPalette, shade: 500 });
        }
    };

    const handlePaletteChange = (palette: string) => {
        if (isTransparent) return;
        onChange({ palette, shade: value.shade });
    };

    const handleShadeChange = (shade: PaletteShade) => {
        if (isTransparent) return;
        onChange({ palette: value.palette, shade });
    };

    return (
        <div style={wrapperStyle}>
            <span style={labelStyle}>{label}</span>
            <div style={swatchStyle(resolved)} title={resolved} />
            <label style={transparentToggleStyle}>
                <input
                    type="checkbox"
                    checked={isTransparent}
                    onChange={(e) => handleToggleTransparent(e.target.checked)}
                />
                transparent
            </label>
            {!isTransparent && (
                <>
                    <select
                        value={selectedPalette}
                        onChange={(e) => handlePaletteChange(e.target.value)}
                        style={selectStyle}
                    >
                        {paletteNames.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedShade}
                        onChange={(e) => handleShadeChange(Number(e.target.value) as PaletteShade)}
                        style={selectStyle}
                    >
                        {SHADES.map((shade) => (
                            <option key={shade} value={shade}>{shade}</option>
                        ))}
                    </select>
                </>
            )}
        </div>
    );
}
