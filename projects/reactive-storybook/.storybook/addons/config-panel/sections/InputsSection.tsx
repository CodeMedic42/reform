import React, { useCallback, useState } from 'react';
import { NumberInput } from '../components/NumberInput';
import { ColorPicker } from '../components/ColorPicker';
import { SectionDescription } from '../components/SectionDescription';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, FieldContainerVariant } from '../types';

const CONTAINER_FIELDS: { key: keyof FieldContainerVariant; label: string; type: 'text' | 'number' | 'color' }[] = [
    { key: 'height', label: 'Height', type: 'text' },
    { key: 'padding-h', label: 'Padding Horizontal', type: 'text' },
    { key: 'padding-v', label: 'Padding Vertical', type: 'text' },
    { key: 'font-size', label: 'Font Size', type: 'text' },
    { key: 'font-weight', label: 'Font Weight', type: 'number' },
    { key: 'line-height', label: 'Line Height', type: 'text' },
    { key: 'background-color', label: 'Background Color', type: 'color' },
    { key: 'border-width', label: 'Border Width', type: 'text' },
    { key: 'focus-outline-width', label: 'Focus Outline Width', type: 'text' },
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

const DEFAULT_CONTAINER_VARIANT: FieldContainerVariant = {
    height: '40px',
    'padding-h': '12px',
    'padding-v': '0',
    'font-size': '16px',
    'font-weight': 400,
    'line-height': '24px',
    'background-color': '#ffffff',
    'border-width': '1px',
    'focus-outline-width': '1px',
};

interface InputsSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function InputsSection({ config, onChange }: InputsSectionProps) {
    const [newVariantName, setNewVariantName] = useState('');

    const updateInput = useCallback((key: string, value: string) => {
        onChange((prev) => ({
            ...prev,
            inputs: {
                ...prev.inputs,
                [key]: value,
            },
        }));
    }, [onChange]);

    const updateContainerDefault = useCallback((key: keyof FieldContainerVariant, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            inputs: {
                ...prev.inputs,
                containerDefault: {
                    ...prev.inputs.containerDefault,
                    [key]: value,
                },
            },
        }));
    }, [onChange]);

    const updateContainerVariant = useCallback((name: string, key: keyof FieldContainerVariant, value: string | number) => {
        onChange((prev) => ({
            ...prev,
            inputs: {
                ...prev.inputs,
                containerVariants: {
                    ...prev.inputs.containerVariants,
                    [name]: {
                        ...prev.inputs.containerVariants[name],
                        [key]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const addVariant = useCallback(() => {
        const name = newVariantName.trim().toLowerCase();
        if (!name || config.inputs.containerVariants[name]) return;

        onChange((prev) => ({
            ...prev,
            inputs: {
                ...prev.inputs,
                containerVariants: {
                    ...prev.inputs.containerVariants,
                    [name]: { ...DEFAULT_CONTAINER_VARIANT },
                },
            },
        }));
        setNewVariantName('');
    }, [newVariantName, config, onChange]);

    const removeVariant = useCallback((name: string) => {
        onChange((prev) => {
            const containerVariants = { ...prev.inputs.containerVariants };
            delete containerVariants[name];
            return { ...prev, inputs: { ...prev.inputs, containerVariants } };
        });
    }, [onChange]);

    const renderContainerEditor = (
        variant: FieldContainerVariant,
        onUpdate: (key: keyof FieldContainerVariant, value: string | number) => void,
    ) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CONTAINER_FIELDS.map(({ key, label, type }) => {
                if (type === 'color') {
                    return (
                        <ColorPicker
                            key={key}
                            label={label}
                            value={String(variant[key])}
                            onChange={(v) => onUpdate(key, v)}
                        />
                    );
                }
                return (
                    <NumberInput
                        key={key}
                        label={label}
                        value={String(variant[key])}
                        onChange={(v) => onUpdate(key, type === 'number' ? (parseInt(v) || 0) : v)}
                    />
                );
            })}
        </div>
    );

    return (
        <div>
            <SectionDescription
                title="Inputs"
                description="Controls form-field containers (text inputs, select fields, etc.): height, padding, font, border, and focus styling. The default container variant applies to every field; named variants are opted in via the field's `variant` prop."
            />
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Global Input Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <ColorPicker label="Focus Color" value={config.inputs.focusColor} onChange={(v) => updateInput('focusColor', v)} />
                <NumberInput label="Border Radius" value={config.inputs.borderRadius} onChange={(v) => updateInput('borderRadius', v)} />
                <NumberInput label="Border Width" value={config.inputs.borderWidth} onChange={(v) => updateInput('borderWidth', v)} />
                <NumberInput label="Focused Border Width" value={config.inputs.focusedBorderWidth} onChange={(v) => updateInput('focusedBorderWidth', v)} />
            </div>

            <SectionHeader title="Default Container Variant" level={0} defaultOpen>
                {renderContainerEditor(config.inputs.containerDefault, updateContainerDefault)}
            </SectionHeader>

            <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Container Variants</h3>
            {Object.entries(config.inputs.containerVariants).map(([name, variant]) => (
                <SectionHeader
                    key={name}
                    title={name}
                    level={0}
                    onRemove={() => removeVariant(name)}
                >
                    {renderContainerEditor(variant, (key, value) => updateContainerVariant(name, key, value))}
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
