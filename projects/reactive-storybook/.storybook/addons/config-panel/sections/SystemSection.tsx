import React, { useCallback } from 'react';
import { ColorPicker } from '../components/ColorPicker';
import { NumberInput } from '../components/NumberInput';
import { SectionDescription } from '../components/SectionDescription';
import type { ConfigState } from '../types';

interface SystemSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function SystemSection({ config, onChange }: SystemSectionProps) {
    const updateColor = useCallback((name: string, value: string) => {
        onChange((prev) => ({
            ...prev,
            system: {
                ...prev.system,
                colors: {
                    ...prev.system.colors,
                    defaults: {
                        ...prev.system.colors.defaults,
                        [name]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    const updateStyle = useCallback((name: string, value: string) => {
        onChange((prev) => ({
            ...prev,
            system: {
                ...prev.system,
                styles: {
                    ...prev.system.styles,
                    defaults: {
                        ...prev.system.styles.defaults,
                        [name]: value,
                    },
                },
            },
        }));
    }, [onChange]);

    return (
        <div>
            <SectionDescription
                title="System"
                description="One-off library-wide values that don't fit a category: the page background, the maximum content width, and similar global settings used by the library's root styling."
            />
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>System Colors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {Object.entries(config.system.colors.defaults).map(([name, value]) => (
                    <ColorPicker
                        key={name}
                        label={name}
                        value={value}
                        onChange={(v) => updateColor(name, v)}
                    />
                ))}
            </div>

            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>System Styles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(config.system.styles.defaults).map(([name, value]) => (
                    <NumberInput
                        key={name}
                        label={name}
                        value={value}
                        onChange={(v) => updateStyle(name, v)}
                    />
                ))}
            </div>
        </div>
    );
}
