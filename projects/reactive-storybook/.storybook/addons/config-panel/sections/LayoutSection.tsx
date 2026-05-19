import React, { useCallback } from 'react';
import { NumberInput } from '../components/NumberInput';
import type { ConfigState } from '../types';

interface LayoutSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

const addButtonStyle: React.CSSProperties = {
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #029cfd',
    background: '#029cfd',
    color: '#fff',
};

const removeButtonStyle: React.CSSProperties = {
    padding: '4px 6px',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '3px',
    border: '1px solid #dc3545',
    background: 'transparent',
    color: '#dc3545',
    lineHeight: 1,
};

const warningStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#dc3545',
    marginTop: '4px',
    padding: '4px 8px',
    background: '#fff3f3',
    borderRadius: '4px',
    border: '1px solid #f5c6cb',
};

const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
};

const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '4px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#555',
};

const checkboxCellStyle: React.CSSProperties = {
    width: '52px',
    textAlign: 'center',
    flexShrink: 0,
};

function parseNumericValue(value: string): number {
    return parseFloat(value) || 0;
}

function isAscending(breakpoints: string[]): boolean {
    for (let i = 1; i < breakpoints.length; i++) {
        if (parseNumericValue(breakpoints[i]) <= parseNumericValue(breakpoints[i - 1])) {
            return false;
        }
    }
    return true;
}

export function LayoutSection({ config, onChange }: LayoutSectionProps) {
    const updateBreakpoint = useCallback((index: number, value: string) => {
        onChange((prev) => {
            const breakpoints = [...prev.layout.breakpoints];
            breakpoints[index] = value;
            return { ...prev, layout: { ...prev.layout, breakpoints } };
        });
    }, [onChange]);

    const addBreakpoint = useCallback(() => {
        onChange((prev) => {
            const breakpoints = [...prev.layout.breakpoints];
            const lastValue = breakpoints.length > 0
                ? parseNumericValue(breakpoints[breakpoints.length - 1])
                : 800;
            breakpoints.push(`${lastValue + 200}px`);
            return { ...prev, layout: { ...prev.layout, breakpoints } };
        });
    }, [onChange]);

    const removeBreakpoint = useCallback((index: number) => {
        onChange((prev) => {
            const breakpoints = prev.layout.breakpoints.filter((_, i) => i !== index);

            // Adjust tablet/desktop indices when a breakpoint is removed
            let { tabletBreakpoint, desktopBreakpoint } = prev.layout;
            if (tabletBreakpoint !== null) {
                if (tabletBreakpoint === index) {
                    tabletBreakpoint = null;
                } else if (tabletBreakpoint > index) {
                    tabletBreakpoint -= 1;
                }
            }
            if (desktopBreakpoint !== null) {
                if (desktopBreakpoint === index) {
                    desktopBreakpoint = null;
                } else if (desktopBreakpoint > index) {
                    desktopBreakpoint -= 1;
                }
            }

            return { ...prev, layout: { ...prev.layout, breakpoints, tabletBreakpoint, desktopBreakpoint } };
        });
    }, [onChange]);

    const toggleTablet = useCallback((index: number) => {
        onChange((prev) => {
            const tabletBreakpoint = prev.layout.tabletBreakpoint === index ? null : index;
            return { ...prev, layout: { ...prev.layout, tabletBreakpoint } };
        });
    }, [onChange]);

    const toggleDesktop = useCallback((index: number) => {
        onChange((prev) => {
            const desktopBreakpoint = prev.layout.desktopBreakpoint === index ? null : index;
            return { ...prev, layout: { ...prev.layout, desktopBreakpoint } };
        });
    }, [onChange]);

    const ascending = isAscending(config.layout.breakpoints);

    return (
        <div>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0' }}>Responsive Breakpoints</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={headerRowStyle}>
                    <div style={{ flex: 1 }} />
                    <div style={checkboxCellStyle}>Tablet</div>
                    <div style={checkboxCellStyle}>Desktop</div>
                    <div style={{ width: '26px' }} />
                </div>
                {config.layout.breakpoints.map((bp, i) => (
                    <div key={i} style={rowStyle}>
                        <NumberInput
                            label={`Breakpoint ${i + 1}`}
                            value={bp}
                            onChange={(v) => updateBreakpoint(i, v)}
                        />
                        <div style={checkboxCellStyle}>
                            <input
                                type="checkbox"
                                checked={config.layout.tabletBreakpoint === i}
                                onChange={() => toggleTablet(i)}
                                title="Tablet breakpoint"
                            />
                        </div>
                        <div style={checkboxCellStyle}>
                            <input
                                type="checkbox"
                                checked={config.layout.desktopBreakpoint === i}
                                onChange={() => toggleDesktop(i)}
                                title="Desktop breakpoint"
                            />
                        </div>
                        <button
                            style={{
                                ...removeButtonStyle,
                                ...(config.layout.breakpoints.length <= 1
                                    ? { opacity: 0.4, cursor: 'not-allowed' }
                                    : {}),
                            }}
                            onClick={() => removeBreakpoint(i)}
                            disabled={config.layout.breakpoints.length <= 1}
                            title="Remove breakpoint"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            {!ascending && (
                <div style={warningStyle}>
                    Breakpoints must be in ascending order for responsive behavior to work correctly.
                </div>
            )}
            <div style={{ marginTop: '12px' }}>
                <button style={addButtonStyle} onClick={addBreakpoint}>
                    Add Breakpoint
                </button>
            </div>
        </div>
    );
}
