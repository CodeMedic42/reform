import React, { useCallback } from 'react';
import { NumberInput } from '../components/NumberInput';
import type { ConfigState } from '../types';

interface BaseTypographySectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function BaseTypographySection({ config, onChange }: BaseTypographySectionProps) {
    const updateBase = useCallback((key: keyof ConfigState['base'], value: string | number) => {
        onChange((prev) => ({
            ...prev,
            base: {
                ...prev.base,
                [key]: value,
            },
        }));
    }, [onChange]);

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Base Typography</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NumberInput
                    label="Font Size"
                    value={config.base.fontSize}
                    onChange={(v) => updateBase('fontSize', v)}
                />
                <NumberInput
                    label="Font Weight"
                    value={String(config.base.fontWeight)}
                    onChange={(v) => updateBase('fontWeight', parseInt(v) || 400)}
                />
            </div>
        </div>
    );
}
