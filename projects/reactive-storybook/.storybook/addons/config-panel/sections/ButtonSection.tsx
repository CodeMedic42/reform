import React, { useCallback, useState } from 'react';
import { NumberInput } from '../components/NumberInput';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, ButtonVariant } from '../types';

const VARIANT_FIELDS: { key: keyof ButtonVariant; label: string }[] = [
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

const DEFAULT_BUTTON_VARIANT: ButtonVariant = {
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
    const [newVariantName, setNewVariantName] = useState('');

    const updateDefaultVariant = useCallback((key: keyof ButtonVariant, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                defaultVariant: {
                    ...prev.button.defaultVariant,
                    [key]: value,
                },
            },
        }));
    }, [onChange]);

    const updateVariant = useCallback((name: string, key: keyof ButtonVariant, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                variants: {
                    ...prev.button.variants,
                    [name]: {
                        ...prev.button.variants[name],
                        [key]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const addVariant = useCallback(() => {
        const name = newVariantName.trim().toLowerCase();
        if (!name || config.button.variants[name]) return;

        onChange((prev) => ({
            ...prev,
            button: {
                ...prev.button,
                variants: {
                    ...prev.button.variants,
                    [name]: { ...DEFAULT_BUTTON_VARIANT },
                },
            },
        }));
        setNewVariantName('');
    }, [newVariantName, config, onChange]);

    const removeVariant = useCallback((name: string) => {
        onChange((prev) => {
            const variants = { ...prev.button.variants };
            delete variants[name];
            return { ...prev, button: { ...prev.button, variants } };
        });
    }, [onChange]);

    const renderVariantEditor = (
        variant: ButtonVariant,
        onUpdate: (key: keyof ButtonVariant, value: string | number) => void,
    ) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {VARIANT_FIELDS.map(({ key, label }) => {
                if (key === 'min-width' && variant['min-width'] === undefined) return null;
                return (
                    <NumberInput
                        key={key}
                        label={label}
                        value={String(variant[key] ?? '')}
                        onChange={(v) => onUpdate(key, key === 'font-weight' ? (parseInt(v) || 400) : v)}
                    />
                );
            })}
        </div>
    );

    return (
        <div>
            <SectionHeader title="Default Variant" level={0} defaultOpen>
                {renderVariantEditor(config.button.defaultVariant, updateDefaultVariant)}
            </SectionHeader>

            <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Variants</h3>
            {Object.entries(config.button.variants).map(([name, variant]) => (
                <SectionHeader
                    key={name}
                    title={name}
                    level={0}
                    onRemove={() => removeVariant(name)}
                >
                    {renderVariantEditor(variant, (key, value) => updateVariant(name, key, value))}
                </SectionHeader>
            ))}

            <div style={addBarStyle}>
                <input
                    type="text"
                    placeholder="Variant name"
                    value={newVariantName}
                    onChange={(e) => setNewVariantName(e.target.value)}
                    style={addInputStyle}
                    onKeyDown={(e) => e.key === 'Enter' && addVariant()}
                />
                <button style={addButtonStyle} onClick={addVariant}>
                    Add Variant
                </button>
            </div>
        </div>
    );
}
