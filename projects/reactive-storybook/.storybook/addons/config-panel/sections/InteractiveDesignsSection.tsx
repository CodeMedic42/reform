import React, { useCallback, useState } from 'react';
import { PaletteRefPicker } from '../components/PaletteRefPicker';
import { SectionDescription } from '../components/SectionDescription';
import { SectionHeader } from '../components/SectionHeader';
import type {
    ConfigState,
    InteractiveScheme,
    PaletteRef,
    VariantStateSlots,
    VariantStates,
} from '../types';
import { buildPaletteMap } from '../util/resolve-palette-ref';

type SchemeSource = 'schemes' | 'custom';
type StateKey = keyof VariantStates;
type SlotKey = keyof VariantStateSlots;

const STATES: StateKey[] = ['default', 'hover', 'focus', 'active', 'disabled'];
const SLOTS: SlotKey[] = ['clr', 'bg', 'br', 'out'];
const SLOT_LABELS: Record<SlotKey, string> = {
    clr: 'Color',
    bg: 'Background',
    br: 'Border',
    out: 'Outline',
};

const T: PaletteRef = 'transparent';

function emptySlots(): VariantStateSlots {
    return { clr: T, bg: T, br: T, out: T };
}

function emptyVariant(): VariantStates {
    return {
        default: emptySlots(),
        hover: emptySlots(),
        focus: emptySlots(),
        active: emptySlots(),
        disabled: emptySlots(),
    };
}

function collectVariantNames(prev: ConfigState): string[] {
    const names = new Set<string>();
    for (const scheme of [
        ...Object.values(prev.interactiveDesigns.schemes),
        ...Object.values(prev.interactiveDesigns.custom),
    ]) {
        for (const v of Object.keys(scheme.variants)) names.add(v);
    }
    if (names.size === 0) {
        names.add('base');
        names.add('fill');
    }
    return [...names];
}

function buildEmptyScheme(variantNames: string[]): InteractiveScheme {
    const variants: Record<string, VariantStates> = {};
    for (const name of variantNames) {
        variants[name] = emptyVariant();
    }
    return { variants };
}

function addVariantToAllSchemes(prev: ConfigState, variantName: string): ConfigState {
    const apply = (schemes: Record<string, InteractiveScheme>): Record<string, InteractiveScheme> => {
        const next: Record<string, InteractiveScheme> = {};
        for (const [name, scheme] of Object.entries(schemes)) {
            if (scheme.variants[variantName]) {
                next[name] = scheme;
            } else {
                next[name] = { ...scheme, variants: { ...scheme.variants, [variantName]: emptyVariant() } };
            }
        }
        return next;
    };
    return {
        ...prev,
        interactiveDesigns: {
            ...prev.interactiveDesigns,
            schemes: apply(prev.interactiveDesigns.schemes),
            custom: apply(prev.interactiveDesigns.custom),
        },
    };
}

function removeVariantFromAllSchemes(prev: ConfigState, variantName: string): ConfigState {
    const apply = (schemes: Record<string, InteractiveScheme>): Record<string, InteractiveScheme> => {
        const next: Record<string, InteractiveScheme> = {};
        for (const [name, scheme] of Object.entries(schemes)) {
            if (!scheme.variants[variantName]) {
                next[name] = scheme;
                continue;
            }
            const { [variantName]: _removed, ...rest } = scheme.variants;
            next[name] = { ...scheme, variants: rest };
        }
        return next;
    };
    return {
        ...prev,
        interactiveDesigns: {
            ...prev.interactiveDesigns,
            schemes: apply(prev.interactiveDesigns.schemes),
            custom: apply(prev.interactiveDesigns.custom),
        },
    };
}

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

const restoreButtonStyle: React.CSSProperties = {
    padding: '4px 10px',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '3px',
    border: '1px solid #198754',
    background: 'transparent',
    color: '#198754',
    marginRight: '4px',
};

const removedAreaStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '8px 12px',
    background: '#f8f8f8',
    borderRadius: '4px',
    border: '1px solid #e6e6e6',
};

interface InteractiveDesignsSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
    removedDefaults: string[];
    onRemoveDefault: (name: string) => void;
    onRestoreDefault: (name: string) => void;
}

export function InteractiveDesignsSection({
    config,
    onChange,
    removedDefaults,
    onRemoveDefault,
    onRestoreDefault,
}: InteractiveDesignsSectionProps) {
    const [newSchemeName, setNewSchemeName] = useState('');
    const [newVariantNames, setNewVariantNames] = useState<Record<string, string>>({});
    const palettes = buildPaletteMap(config);

    const updateSlot = useCallback((
        source: SchemeSource,
        schemeName: string,
        variantName: string,
        state: StateKey,
        slot: SlotKey,
        value: PaletteRef,
    ) => {
        onChange((prev) => {
            const scheme = prev.interactiveDesigns[source][schemeName];
            const variant = scheme.variants[variantName];
            const updatedSlots: VariantStateSlots = { ...variant[state], [slot]: value };
            const updatedVariant: VariantStates = { ...variant, [state]: updatedSlots };
            return {
                ...prev,
                interactiveDesigns: {
                    ...prev.interactiveDesigns,
                    [source]: {
                        ...prev.interactiveDesigns[source],
                        [schemeName]: {
                            ...scheme,
                            variants: { ...scheme.variants, [variantName]: updatedVariant },
                        },
                    },
                },
            };
        });
    }, [onChange]);

    const addScheme = useCallback(() => {
        const name = newSchemeName.trim().toLowerCase();
        if (!name || config.interactiveDesigns.schemes[name] || config.interactiveDesigns.custom[name]) return;
        onChange((prev) => ({
            ...prev,
            interactiveDesigns: {
                ...prev.interactiveDesigns,
                custom: { ...prev.interactiveDesigns.custom, [name]: buildEmptyScheme(collectVariantNames(prev)) },
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

    const addVariant = useCallback((source: SchemeSource, schemeName: string) => {
        const key = `${source}:${schemeName}`;
        const variantName = (newVariantNames[key] ?? '').trim().toLowerCase();
        if (!variantName) return;
        onChange((prev) => addVariantToAllSchemes(prev, variantName));
        setNewVariantNames((prev) => ({ ...prev, [key]: '' }));
    }, [newVariantNames, onChange]);

    const removeVariant = useCallback((variantName: string) => {
        if (variantName === 'base') return;
        onChange((prev) => removeVariantFromAllSchemes(prev, variantName));
    }, [onChange]);

    const renderState = (
        source: SchemeSource,
        schemeName: string,
        variantName: string,
        state: StateKey,
        slots: VariantStateSlots,
    ) => (
        <SectionHeader key={state} title={state} level={2}>
            {SLOTS.map((slot) => (
                <PaletteRefPicker
                    key={slot}
                    label={SLOT_LABELS[slot]}
                    value={slots[slot]}
                    palettes={palettes}
                    onChange={(v) => updateSlot(source, schemeName, variantName, state, slot, v)}
                />
            ))}
        </SectionHeader>
    );

    const renderVariant = (
        source: SchemeSource,
        schemeName: string,
        variantName: string,
        variant: VariantStates,
    ) => (
        <SectionHeader
            key={variantName}
            title={variantName}
            level={1}
            onRemove={variantName === 'base' ? undefined : () => removeVariant(variantName)}
        >
            {STATES.map((state) => renderState(source, schemeName, variantName, state, variant[state]))}
        </SectionHeader>
    );

    const renderScheme = (
        name: string,
        scheme: InteractiveScheme,
        source: SchemeSource,
    ) => {
        const key = `${source}:${name}`;
        const variantInput = newVariantNames[key] ?? '';
        return (
            <SectionHeader
                key={name}
                title={name}
                level={0}
                onRemove={source === 'custom' ? () => removeScheme(name) : () => onRemoveDefault(name)}
            >
                {Object.entries(scheme.variants).map(([variantName, variant]) =>
                    renderVariant(source, name, variantName, variant),
                )}
                <div style={addBarStyle}>
                    <input
                        type="text"
                        placeholder="Variant name"
                        value={variantInput}
                        onChange={(e) => setNewVariantNames((prev) => ({ ...prev, [key]: e.target.value }))}
                        style={addInputStyle}
                        onKeyDown={(e) => e.key === 'Enter' && addVariant(source, name)}
                    />
                    <button style={addButtonStyle} onClick={() => addVariant(source, name)}>
                        Add Variant
                    </button>
                    <span style={{ fontSize: '11px', color: '#888' }}>Variants are shared across all schemes.</span>
                </div>
            </SectionHeader>
        );
    };

    return (
        <div>
            <SectionDescription
                title="Interactive"
                description="Defines named color schemes (primary, secondary, danger, etc.) used by interactive components like Button via the `color` prop. Each scheme has one or more variants (base, fill, etc.) and five states (default, hover, focus, active, disabled). Every slot picks a palette color and shade, or transparent. Variants are shared across all schemes."
            />
            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Interactive Schemes</h3>
            {Object.entries(config.interactiveDesigns.schemes).map(([name, scheme]) =>
                renderScheme(name, scheme, 'schemes'),
            )}

            {Object.keys(config.interactiveDesigns.custom).length > 0 && (
                <>
                    <h3 style={{ fontSize: '14px', margin: '16px 0 8px 0' }}>Custom Interactive Schemes</h3>
                    {Object.entries(config.interactiveDesigns.custom).map(([name, scheme]) =>
                        renderScheme(name, scheme, 'custom'),
                    )}
                </>
            )}

            {removedDefaults.length > 0 && (
                <div style={removedAreaStyle}>
                    <h4 style={{ fontSize: '12px', margin: '0 0 8px 0', color: '#666' }}>Removed Defaults</h4>
                    {removedDefaults.map((name) => (
                        <button
                            key={name}
                            style={restoreButtonStyle}
                            onClick={() => onRestoreDefault(name)}
                        >
                            Restore {name}
                        </button>
                    ))}
                </div>
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
