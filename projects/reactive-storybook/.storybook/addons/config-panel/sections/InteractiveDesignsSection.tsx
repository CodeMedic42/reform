import React, { useCallback, useState } from 'react';
import { ColorPicker } from '../components/ColorPicker';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, InteractiveScheme, InteractiveVariant } from '../types';

const VARIANT_PROPS: (keyof InteractiveVariant)[] = [
    'clr', 'bg', 'br', 'out',
    'hover-clr', 'hover-bg', 'hover-br', 'hover-out',
    'focus-clr', 'focus-bg', 'focus-br', 'focus-out',
    'active-clr', 'active-bg', 'active-br', 'active-out',
    'disabled-clr', 'disabled-bg', 'disabled-br', 'disabled-out',
];

const STATE_GROUPS = [
    { label: 'Default', prefix: '', props: ['clr', 'bg', 'br', 'out'] },
    { label: 'Hover', prefix: 'hover-', props: ['hover-clr', 'hover-bg', 'hover-br', 'hover-out'] },
    { label: 'Focus', prefix: 'focus-', props: ['focus-clr', 'focus-bg', 'focus-br', 'focus-out'] },
    { label: 'Active', prefix: 'active-', props: ['active-clr', 'active-bg', 'active-br', 'active-out'] },
    { label: 'Disabled', prefix: 'disabled-', props: ['disabled-clr', 'disabled-bg', 'disabled-br', 'disabled-out'] },
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

const DEFAULT_VARIANT: InteractiveVariant = {
    clr: '#333333',
    bg: 'transparent',
    br: 'transparent',
    out: 'transparent',
    'hover-clr': '#222222',
    'hover-bg': 'transparent',
    'hover-br': 'transparent',
    'hover-out': 'transparent',
    'focus-clr': '#222222',
    'focus-bg': 'transparent',
    'focus-br': 'transparent',
    'focus-out': 'transparent',
    'active-clr': '#111111',
    'active-bg': 'transparent',
    'active-br': 'transparent',
    'active-out': 'transparent',
};

const DEFAULT_FILL_VARIANT: InteractiveVariant = {
    clr: '#ffffff',
    bg: '#333333',
    br: '#333333',
    out: 'transparent',
    'hover-clr': '#ffffff',
    'hover-bg': '#222222',
    'hover-br': '#222222',
    'hover-out': 'transparent',
    'focus-clr': '#ffffff',
    'focus-bg': '#222222',
    'focus-br': '#222222',
    'focus-out': 'rgba(51, 51, 51, 0.5)',
    'active-clr': '#ffffff',
    'active-bg': '#111111',
    'active-br': '#111111',
    'active-out': 'transparent',
};

interface InteractiveDesignsSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function InteractiveDesignsSection({ config, onChange }: InteractiveDesignsSectionProps) {
    const [newSchemeName, setNewSchemeName] = useState('');

    const updateVariantProp = useCallback((
        source: 'schemes' | 'custom',
        schemeName: string,
        variantType: 'base' | 'fill',
        prop: keyof InteractiveVariant,
        value: string,
    ) => {
        onChange((prev) => ({
            ...prev,
            interactiveDesigns: {
                ...prev.interactiveDesigns,
                [source]: {
                    ...prev.interactiveDesigns[source],
                    [schemeName]: {
                        ...prev.interactiveDesigns[source][schemeName],
                        [variantType]: {
                            ...prev.interactiveDesigns[source][schemeName][variantType],
                            [prop]: value,
                        },
                    },
                },
            },
        }));
    }, [onChange]);

    const addScheme = useCallback(() => {
        const name = newSchemeName.trim().toLowerCase();
        if (!name || config.interactiveDesigns.schemes[name] || config.interactiveDesigns.custom[name]) return;

        onChange((prev) => ({
            ...prev,
            interactiveDesigns: {
                ...prev.interactiveDesigns,
                custom: {
                    ...prev.interactiveDesigns.custom,
                    [name]: {
                        base: { ...DEFAULT_VARIANT },
                        fill: { ...DEFAULT_FILL_VARIANT },
                    },
                },
            },
        }));
        setNewSchemeName('');
    }, [newSchemeName, config, onChange]);

    const removeScheme = useCallback((name: string) => {
        onChange((prev) => {
            const custom = { ...prev.interactiveDesigns.custom };
            delete custom[name];
            return { ...prev, interactiveDesigns: { ...prev.interactiveDesigns, custom } };
        });
    }, [onChange]);

    const renderVariant = (
        schemeName: string,
        variantType: 'base' | 'fill',
        variant: InteractiveVariant,
        source: 'schemes' | 'custom',
    ) => (
        <SectionHeader title={variantType === 'base' ? 'Base Variant' : 'Fill Variant'} level={1}>
            {STATE_GROUPS.map((group) => (
                <SectionHeader key={group.label} title={group.label} level={2}>
                    {group.props.map((prop) => (
                        <ColorPicker
                            key={prop}
                            label={prop.replace(group.prefix, '')}
                            value={variant[prop as keyof InteractiveVariant] ?? 'transparent'}
                            onChange={(v) => updateVariantProp(source, schemeName, variantType, prop as keyof InteractiveVariant, v)}
                        />
                    ))}
                </SectionHeader>
            ))}
        </SectionHeader>
    );

    const renderScheme = (
        name: string,
        scheme: InteractiveScheme,
        source: 'schemes' | 'custom',
    ) => (
        <SectionHeader
            key={name}
            title={name}
            level={0}
            onRemove={source === 'custom' ? () => removeScheme(name) : undefined}
        >
            {renderVariant(name, 'base', scheme.base, source)}
            {renderVariant(name, 'fill', scheme.fill, source)}
        </SectionHeader>
    );

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Default Interactive Schemes</h3>
            {Object.entries(config.interactiveDesigns.schemes).map(([name, scheme]) =>
                renderScheme(name, scheme, 'schemes'),
            )}

            <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Interactive Schemes</h3>
            {Object.entries(config.interactiveDesigns.custom).map(([name, scheme]) =>
                renderScheme(name, scheme, 'custom'),
            )}

            <div style={addBarStyle}>
                <input
                    type="text"
                    placeholder="Scheme name"
                    value={newSchemeName}
                    onChange={(e) => setNewSchemeName(e.target.value)}
                    style={addInputStyle}
                    onKeyDown={(e) => e.key === 'Enter' && addScheme()}
                />
                <button style={addButtonStyle} onClick={addScheme}>
                    Add Scheme
                </button>
            </div>
        </div>
    );
}
