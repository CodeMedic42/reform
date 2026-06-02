import React, { useCallback, useState } from 'react';
import { NumberInput } from '../components/NumberInput';
import { SectionDescription } from '../components/SectionDescription';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, DropDownListItemDesign } from '../types';

const DESIGN_FIELDS: { key: keyof DropDownListItemDesign; label: string }[] = [
    { key: 'padding-v', label: 'Padding Vertical' },
    { key: 'padding-h', label: 'Padding Horizontal' },
    { key: 'font-size', label: 'Font Size' },
    { key: 'line-height', label: 'Line Height' },
    { key: 'min-height', label: 'Min Height' },
    { key: 'ol-border-radius', label: 'OL Border Radius' },
    { key: 'ol-padding-top', label: 'OL Padding Top' },
    { key: 'ol-padding-bottom', label: 'OL Padding Bottom' },
];

const DEFAULT_DROP_DOWN_LIST_ITEM_DESIGN: DropDownListItemDesign = {
    'padding-v': '8px',
    'padding-h': '16px',
    'font-size': '16px',
    'line-height': '24px',
    'min-height': '40px',
    'ol-border-radius': '0',
    'ol-padding-top': '8px',
    'ol-padding-bottom': '8px',
};

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

const defaultBannerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 0',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#aaa',
};

const setDefaultButtonStyle: React.CSSProperties = {
    padding: '3px 10px',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '3px',
    border: '1px solid #029cfd',
    background: 'transparent',
    color: '#029cfd',
};

const defaultBadgeStyle: React.CSSProperties = {
    padding: '2px 8px',
    fontSize: '11px',
    borderRadius: '3px',
    background: '#029cfd',
    color: '#fff',
    fontWeight: 600,
};

interface DropDownListItemSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function DropDownListItemSection({ config, onChange }: DropDownListItemSectionProps) {
    const [newDesignName, setNewDesignName] = useState('');

    const designs = config.dropDownListItem.designs;
    const defaultDesignName = config.dropDownListItem.defaultDesignName;
    const designNames = Object.keys(designs);
    const onlyOne = designNames.length === 1;

    const updateDesignField = useCallback((name: string, key: keyof DropDownListItemDesign, value: string) => {
        onChange((prev) => ({
            ...prev,
            dropDownListItem: {
                ...prev.dropDownListItem,
                designs: {
                    ...prev.dropDownListItem.designs,
                    [name]: {
                        ...prev.dropDownListItem.designs[name],
                        [key]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const addDesign = useCallback(() => {
        const name = newDesignName.trim();
        if (!name || designs[name]) return;

        onChange((prev) => ({
            ...prev,
            dropDownListItem: {
                ...prev.dropDownListItem,
                designs: {
                    ...prev.dropDownListItem.designs,
                    [name]: { ...DEFAULT_DROP_DOWN_LIST_ITEM_DESIGN },
                },
            },
        }));
        setNewDesignName('');
    }, [newDesignName, designs, onChange]);

    const removeDesign = useCallback((name: string) => {
        onChange((prev) => {
            const nextDesigns = { ...prev.dropDownListItem.designs };
            delete nextDesigns[name];
            return {
                ...prev,
                dropDownListItem: {
                    ...prev.dropDownListItem,
                    designs: nextDesigns,
                },
            };
        });
    }, [onChange]);

    const setAsDefault = useCallback((name: string) => {
        onChange((prev) => ({
            ...prev,
            dropDownListItem: {
                ...prev.dropDownListItem,
                defaultDesignName: name,
            },
        }));
    }, [onChange]);

    const renderDesignEditor = (
        name: string,
        design: DropDownListItemDesign,
        isDefault: boolean,
    ) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={defaultBannerStyle}>
                {isDefault ? (
                    <span style={defaultBadgeStyle}>Default</span>
                ) : (
                    <button
                        type="button"
                        style={setDefaultButtonStyle}
                        onClick={() => setAsDefault(name)}
                    >
                        Set as Default
                    </button>
                )}
            </div>
            {DESIGN_FIELDS.map(({ key, label }) => (
                <NumberInput
                    key={key}
                    label={label}
                    value={String(design[key] ?? '')}
                    onChange={(v) => updateDesignField(name, key, v)}
                />
            ))}
        </div>
    );

    return (
        <div>
            <SectionDescription
                title="Drop Down List Items"
                description="Defines the appearance of items inside drop-down lists used by Menus and Select fields. The default design applies to every drop-down list with no `design` prop; named designs are opted in via the `design` prop on Menu, Select, or MultiSelect. The default cannot be removed (promote another design first), and at least one design must always exist."
            />

            {designNames.map((name) => {
                const isDefault = name === defaultDesignName;
                const removeBlocked = onlyOne || isDefault;
                return (
                    <SectionHeader
                        key={name}
                        title={isDefault ? `${name} (Default)` : name}
                        level={0}
                        onRemove={removeBlocked ? undefined : () => removeDesign(name)}
                    >
                        {renderDesignEditor(name, designs[name], isDefault)}
                    </SectionHeader>
                );
            })}

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
