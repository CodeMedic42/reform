import React, { useCallback } from 'react';
import { ColorPicker } from '../components/ColorPicker';
import type { ConfigState } from '../types';

const GRAYSCALE_KEYS = [
    'g-0', 'g-2', 'g-4', 'g-5', 'g-10', 'g-11', 'g-12', 'g-13',
    'g-20', 'g-30', 'g-40', 'g-50', 'g-60', 'g-70', 'g-80', 'g-90', 'g-100',
    'white', 'black', 'transparent',
];

interface GrayscaleSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function GrayscaleSection({ config, onChange }: GrayscaleSectionProps) {
    const updateGrayscale = useCallback((key: string, value: string) => {
        onChange((prev) => ({
            ...prev,
            grayscale: {
                ...prev.grayscale,
                [key]: value,
            },
        }));
    }, [onChange]);

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Grayscale Colors</h3>
            {GRAYSCALE_KEYS.map((key) => (
                <div key={key} style={{ marginBottom: '4px' }}>
                    <ColorPicker
                        label={key}
                        value={config.grayscale[key]}
                        onChange={(v) => updateGrayscale(key, v)}
                    />
                </div>
            ))}
        </div>
    );
}
