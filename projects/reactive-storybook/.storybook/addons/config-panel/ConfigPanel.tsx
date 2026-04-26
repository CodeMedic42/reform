import React, { useState, useCallback, useEffect } from 'react';
import { useChannel } from 'storybook/manager-api';
import { EVENTS } from './constants';
import { DEFAULT_CONFIG } from './defaults';
import { loadConfig, saveConfig, clearConfig } from './storage';
import { generateScss } from './export/generate-scss';
import { downloadFile } from './export/download';
import { PaletteSection } from './sections/PaletteSection';
import { InteractiveDesignsSection } from './sections/InteractiveDesignsSection';
import { GrayscaleSection } from './sections/GrayscaleSection';
import { BaseTypographySection } from './sections/BaseTypographySection';
import { ButtonSection } from './sections/ButtonSection';
import { TabsSection } from './sections/TabsSection';
import { InputsSection } from './sections/InputsSection';
import { LayoutSection } from './sections/LayoutSection';
import type { ConfigState } from './types';

const TABS = [
    { id: 'palette', label: 'Palette' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'grayscale', label: 'Grayscale' },
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
    const [config, setConfig] = useState<ConfigState>(() => loadConfig());
    const [activeTab, setActiveTab] = useState<TabId>('palette');

    const emit = useChannel({
        [EVENTS.REQUEST_CONFIG]: () => {
            emit(EVENTS.SEND_CONFIG, config);
        },
    });

    const updateConfig = useCallback((updater: (prev: ConfigState) => ConfigState) => {
        setConfig((prev) => {
            const next = updater(prev);
            saveConfig(next);
            emit(EVENTS.CONFIG_CHANGED, next);
            return next;
        });
    }, [emit]);

    // Send initial config on mount
    useEffect(() => {
        emit(EVENTS.CONFIG_CHANGED, config);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleReset = useCallback(() => {
        const fresh = structuredClone(DEFAULT_CONFIG);
        setConfig(fresh);
        saveConfig(fresh);
        emit(EVENTS.CONFIG_CHANGED, fresh);
    }, [emit]);

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
                    <PaletteSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'interactive' && (
                    <InteractiveDesignsSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'grayscale' && (
                    <GrayscaleSection config={config} onChange={updateConfig} />
                )}
                {activeTab === 'typography' && (
                    <BaseTypographySection config={config} onChange={updateConfig} />
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
                    Reset to Defaults
                </button>
                <button style={{ ...buttonStyle, background: '#029cfd', color: '#fff', borderColor: '#029cfd' }} onClick={handleExport}>
                    Export SCSS
                </button>
            </div>
        </div>
    );
}
