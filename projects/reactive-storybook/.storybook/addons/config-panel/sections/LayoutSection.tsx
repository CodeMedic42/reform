import React, { useCallback } from 'react';
import { NumberInput } from '../components/NumberInput';
import type { ConfigState } from '../types';

interface LayoutSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

const BREAKPOINT_LABELS = ['Breakpoint 1', 'Breakpoint 2 (Tablet)', 'Breakpoint 3 (Desktop)', 'Breakpoint 4'];

export function LayoutSection({ config, onChange }: LayoutSectionProps) {
    const updateBreakpoint = useCallback((index: number, value: string) => {
        onChange((prev) => {
            const breakpoints = [...prev.layout.breakpoints];
            breakpoints[index] = value;
            return { ...prev, layout: { ...prev.layout, breakpoints } };
        });
    }, [onChange]);

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Responsive Breakpoints</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {config.layout.breakpoints.map((bp, i) => (
                    <NumberInput
                        key={i}
                        label={BREAKPOINT_LABELS[i] || `Breakpoint ${i + 1}`}
                        value={bp}
                        onChange={(v) => updateBreakpoint(i, v)}
                    />
                ))}
            </div>
        </div>
    );
}
