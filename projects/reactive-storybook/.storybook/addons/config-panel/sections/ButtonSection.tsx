import React, { useCallback, useState } from 'react';
import { NumberInput } from '../components/NumberInput';
import { SectionDescription } from '../components/SectionDescription';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, ButtonDesign } from '../types';

const DESIGN_FIELDS: { key: keyof ButtonDesign; label: string }[] = [
    { key: 'padding-v', label: 'Padding Vertical' },
    { key: 'padding-h', label: 'Padding Horizontal' },
    { key: 'border-radius', label: 'Border Radius' },
    { key: 'font-size', label: 'Font Size' },
    { key: 'font-weight', label: 'Font Weight' },
    { key: 'line-height', label: 'Line Height' },
    { key: 'min-width', label: 'Min Width' },
];

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

const DEFAULT_BUTTON_DESIGN: ButtonDesign = {
    'padding-v': '6px',
    'padding-h': '12px',
    'border-radius': '6px',
    'font-size': '16px',
    'font-weight': 400,
    'line-height': '24px',
};

interface ButtonSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function ButtonSection({ config, onChange }: ButtonSectionProps) {
    const [newDesignName, setNewDesignName] = useState('');

    const updateDefaultDesign = useCallback((key: keyof ButtonDesign, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                defaultDesign: {
                    ...prev.button.defaultDesign,
                    [key]: value,
                },
            },
        }));
    }, [onChange]);

    const updateDesign = useCallback((name: string, key: keyof ButtonDesign, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                designs: {
                    ...prev.button.designs,
                    [name]: {
                        ...prev.button.designs[name],
                        [key]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const addDesign = useCallback(() => {
        const name = newDesignName.trim().toLowerCase();
        if (!name || config.button.designs[name]) return;

        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                designs: {
                    ...prev.button.designs,
                    [name]: { ...DEFAULT_BUTTON_DESIGN },
                },
            },
        }));
        setNewDesignName('');
    }, [newDesignName, config, onChange]);

    const removeDesign = useCallback((name: string) => {
        onChange((prev) => {
            const designs = { ...prev.button.designs };
            delete designs[name];
            return { ...prev, button: { ...prev.button, designs } };
        });
    }, [onChange]);

    const renderDesignEditor = (
        design: ButtonDesign,
        onUpdate: (key: keyof ButtonDesign, value: string | number) => void,
    ) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DESIGN_FIELDS.map(({ key, label }) => {
                if (key === 'min-width' && design['min-width'] === undefined) return null;
                return (
                    <NumberInput
                        key={key}
                        label={label}
                        value={String(design[key] ?? '')}
                        onChange={(v) => onUpdate(key, key === 'font-weight' ? (parseInt(v) || 400) : v)}
                    />
                );
            })}
        </div>
    );

    return (
        <div>
            <SectionDescription
                title="Button"
                description="Defines button shape: padding, border-radius, font size and weight, line height, and optional minimum width. The default design applies to every Button; named designs (e.g. sm, lg-long) are opted in via the Button's `design` prop. Button colors come from the Interactive section."
            />
            <SectionHeader title="Default Design" level={0} defaultOpen>
                {renderDesignEditor(config.button.defaultDesign, updateDefaultDesign)}
            </SectionHeader>

            <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Designs</h3>
            {Object.entries(config.button.designs).map(([name, design]) => (
                <SectionHeader
                    key={name}
                    title={name}
                    level={0}
                    onRemove={() => removeDesign(name)}
                >
                    {renderDesignEditor(design, (key, value) => updateDesign(name, key, value))}
                </SectionHeader>
            ))}

            <div style={addBarStyle}>
                <input
                    type="text"
                    placeholder="Design name"
                    value={newDesignName}
                    onChange={(e) => setNewDesignName(e.target.value)}
                    style={addInputStyle}
                    onKeyDown={(e) => e.key === 'Enter' && addDesign()}
                />
                <button style={addButtonStyle} onClick={addDesign}>
                    Add Design
                </button>
            </div>
        </div>
    );
}
