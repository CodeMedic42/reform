import React, { useState, useCallback, useEffect } from 'react';
import { useChannel } from 'storybook/manager-api';
import { EVENTS } from './constants';
import { DEFAULT_CONFIG } from './defaults';
import { loadPanelState, savePanelState } from './storage';
import type { RemovedDefaults } from './storage';
import { generateScss } from './export/generate-scss';
import { downloadFile } from './export/download';
import { PaletteSection } from './sections/PaletteSection';
import { InteractiveDesignsSection } from './sections/InteractiveDesignsSection';
import { GrayscaleSection } from './sections/GrayscaleSection';
import { SystemSection } from './sections/SystemSection';
import { TypographySection } from './sections/TypographySection';
import { ButtonSection } from './sections/ButtonSection';
import { TabsSection } from './sections/TabsSection';
import { InputsSection } from './sections/InputsSection';
import { LayoutSection } from './sections/LayoutSection';
import type { ConfigState } from './types';

const TABS = [
    { id: 'palette', label: 'Palette' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'grayscale', label: 'Grayscale' },
    { id: 'system', label: 'System' },
    { id: 'typography', label: 'Typography' },
    { id: 'button', label: 'Button' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'layout', label: 'Layout' },
] as const;

type TabId = typeof TABS[number]['id'];

const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid #e6e6e6',
    padding: '0 8px',
    flexShrink: 0,
};

const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 12px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid #029cfd' : '2px solid transparent',
    color: active ? '#029cfd' : '#666',
    fontWeight: active ? 600 : 400,
    fontSize: '12px',
});

const footerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    borderTop: '1px solid #e6e6e6',
    flexShrink: 0,
};

const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: '#fff',
    color: '#333',
};

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
};

const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
};

interface ConfigPanelProps {
    active?: boolean;
}

export function ConfigPanel({ active }: ConfigPanelProps) {
    const [config, setConfig] = useState<ConfigState>(() => loadPanelState().config);
    const [removedDefaults, setRemovedDefaults] = useState<RemovedDefaults>(() => loadPanelState().removedDefaults);
    const [activeTab, setActiveTab] = useState<TabId>('palette');

    const emit = useChannel({
        [EVENTS.REQUEST_CONFIG]: () => {
            emit(EVENTS.SEND_CONFIG, config);
        },
    });

    const persist = useCallback((nextConfig: ConfigState, nextRemoved: RemovedDefaults) => {
        savePanelState({ config: nextConfig, removedDefaults: nextRemoved });
        emit(EVENTS.CONFIG_CHANGED, nextConfig);
    }, [emit]);

    const updateConfig = useCallback((updater: (prev: ConfigState) => ConfigState) => {
        setConfig((prev) => {
            const next = updater(prev);
            persist(next, removedDefaults);
            return next;
        });
    }, [persist, removedDefaults]);

    const updateRemoved = useCallback((updater: (prev: RemovedDefaults) => RemovedDefaults) => {
        setRemovedDefaults((prev) => {
            const next = updater(prev);
            savePanelState({ config, removedDefaults: next });
            return next;
        });
    }, [config]);

    // Send initial config on mount
    useEffect(() => {
        emit(EVENTS.CONFIG_CHANGED, config);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleReset = useCallback(() => {
        const fresh = structuredClone(DEFAULT_CONFIG);
        const emptyRemoved: RemovedDefaults = { paletteColors: [], interactiveSchemes: [] };
        setConfig(fresh);
        setRemovedDefaults(emptyRemoved);
        persist(fresh, emptyRemoved);
    }, [persist]);

    const handleExport = useCallback(() => {
        const scss = generateScss(config);
        downloadFile(scss, 'styles.scss', 'text/x-scss');
    }, [config]);

    if (!active) {
        return null;
    }

    return (
        <div style={containerStyle}>
            <div style={tabBarStyle}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        style={tabStyle(activeTab === tab.id)}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={contentStyle}>
                {activeTab === 'palette' && (
                    <PaletteSection
                        config={config}
                        onChange={updateConfig}
                        removedDefaults={removedDefaults.paletteColors}
                        onRemoveDefault={(name) => {
                            updateConfig((prev) => {
                                const colors = { ...prev.palette.colors };
                                delete colors[name];
                                return { ...prev, palette: { ...prev.palette, colors } };
                            });
                            updateRemoved((prev) => ({
                                ...prev,
                                paletteColors: [...prev.paletteColors, name],
                            }));
                        }}
                        onRestoreDefault={(name) => {
                            const defaultShades = DEFAULT_CONFIG.palette.colors[name];
                            if (!defaultShades) return;
                            updateConfig((prev) => ({
                                ...prev,
                                palette: {
                                    ...prev.palette,
                                    colors: { ...prev.palette.colors, [name]: { ...defaultShades } },
                                },
                            }));
                            updateRemoved((prev) => ({
                                ...prev,
                                paletteColors: prev.paletteColors.filter((n) => n !== name),
                            }));
                        }}
                    />
                )}
                {activeTab === 'interactive' && (
                    <InteractiveDesignsSection
                        config={config}
                        onChange={updateConfig}
                        removedDefaults={removedDefaults.interactiveSchemes}
                        onRemoveDefault={(name) => {
                            updateConfig((prev) => {
                                const schemes = { ...prev.interactiveDesigns.schemes };
                                delete schemes[name];
                                return { ...prev, interactiveDesigns: { ...prev.interactiveDesigns, schemes } };
                            });
                            updateRemoved((prev) => ({
                                ...prev,
                                interactiveSchemes: [...prev.interactiveSchemes, name],
                            }));
                        }}
                        onRestoreDefault={(name) => {
                            const defaultScheme = DEFAULT_CONFIG.interactiveDesigns.schemes[name];
                            if (!defaultScheme) return;
                            updateConfig((prev) => ({
                                ...prev,
                                interactiveDesigns: {
                                    ...prev.interactiveDesigns,
                                    schemes: { ...prev.interactiveDesigns.schemes, [name]: structuredClone(defaultScheme) },
                                },
                            }));
                            updateRemoved((prev) => ({
                                ...prev,
                                interactiveSchemes: prev.interactiveSchemes.filter((n) => n !== name),
                            }));
                        }}
                    />
                )}
                {activeTab === 'grayscale' && (
                    <GrayscaleSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'system' && (
                    <SystemSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'typography' && (
                    <TypographySection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'button' && (
                    <ButtonSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'tabs' && (
                    <TabsSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'inputs' && (
                    <InputsSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'layout' && (
                    <LayoutSection config={config} onChange={updateConfig} />
                )}
            </div>

            <div style={footerStyle}>
                <button style={buttonStyle} onClick={handleReset}>
                    Restore All Defaults
                </button>
                <button style={{ ...buttonStyle, background: '#029cfd', color: '#fff', borderColor: '#029cfd' }} onClick={handleExport}>
                    Export SCSS
                </button>
            </div>
        </div>
    );
}
