import React, { useCallback, useState } from 'react';
import { ColorPicker } from '../components/ColorPicker';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, PaletteShades } from '../types';

const SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const addBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginTop: '12px',
    padding: '8px 0',
};

const addInputStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '120px',
};

const addButtonStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #029cfd',
    background: '#029cfd',
    color: '#fff',
};

interface PaletteSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

const DEFAULT_SHADES: PaletteShades = {
    100: '#e0e0e0',
    200: '#c0c0c0',
    300: '#a0a0a0',
    400: '#808080',
    500: '#606060',
    600: '#505050',
    700: '#404040',
    800: '#303030',
    900: '#202020',
};

export function PaletteSection({ config, onChange }: PaletteSectionProps) {
    const [newColorName, setNewColorName] = useState('');

    const updateColor = useCallback((
        source: 'colors' | 'custom',
        name: string,
        shade: number,
        value: string,
    ) => {
        onChange((prev) => ({
            ...prev,
            palette: {
                ...prev.palette,
                [source]: {
                    ...prev.palette[source],
                    [name]: {
                        ...prev.palette[source][name],
                        [shade]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const addColor = useCallback(() => {
        const name = newColorName.trim().toLowerCase();
        if (!name || config.palette.colors[name] || config.palette.custom[name]) return;

        onChange((prev) => ({
            ...prev,
            palette: {
                ...prev.palette,
                custom: {
                    ...prev.palette.custom,
                    [name]: { ...DEFAULT_SHADES },
                },
            },
        }));
        setNewColorName('');
    }, [newColorName, config, onChange]);

    const removeColor = useCallback((name: string) => {
        onChange((prev) => {
            const custom = { ...prev.palette.custom };
            delete custom[name];
            return { ...prev, palette: { ...prev.palette, custom } };
        });
    }, [onChange]);

    const renderColorGroup = (
        name: string,
        shades: PaletteShades,
        source: 'colors' | 'custom',
    ) => (
        <SectionHeader
            key={name}
            title={name}
            level={0}
            onRemove={source === 'custom' ? () => removeColor(name) : undefined}
        >
            {SHADES.map((shade) => (
                <ColorPicker
                    key={shade}
                    label={String(shade)}
                    value={shades[shade]}
                    onChange={(v) => updateColor(source, name, shade, v)}
                />
            ))}
        </SectionHeader>
    );

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Default Palette Colors</h3>
            {Object.entries(config.palette.colors).map(([name, shades]) =>
                renderColorGroup(name, shades, 'colors'),
            )}

            <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Palette Colors</h3>
            {Object.entries(config.palette.custom).map(([name, shades]) =>
                renderColorGroup(name, shades, 'custom'),
            )}

            <div style={addBarStyle}>
                <input
                    type="text"
                    placeholder="Color name"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    style={addInputStyle}
                    onKeyDown={(e) => e.key === 'Enter' && addColor()}
                />
                <button style={addButtonStyle} onClick={addColor}>
                    Add Color
                </button>
            </div>
        </div>
    );
}
