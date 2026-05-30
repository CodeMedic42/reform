import React, { useCallback } from 'react';
import { NumberInput } from '../components/NumberInput';
import { ColorPicker } from '../components/ColorPicker';
import { SectionDescription } from '../components/SectionDescription';
import { SectionHeader } from '../components/SectionHeader';
import type { ConfigState, TabConfig } from '../types';

interface TabsSectionProps {
    config: ConfigState;
    onChange: (updater: (prev: ConfigState) => ConfigState) => void;
}

export function TabsSection({ config, onChange }: TabsSectionProps) {
    const updateTab = useCallback((key: keyof TabConfig, value: string | number | null) => {
        onChange((prev) => ({
            ...prev,
            tabs: {
                ...prev.tabs,
                [key]: value,
            },
        }));
    }, [onChange]);

    const renderField = (key: keyof TabConfig, label: string, type: 'color' | 'text' | 'number') => {
        const value = config.tabs[key];
        const strValue = value === null ? '' : String(value);

        if (type === 'color') {
            return (
                <ColorPicker
                    key={key}
                    label={label}
                    value={strValue || 'transparent'}
                    onChange={(v) => updateTab(key, v || null)}
                />
            );
        }

        return (
            <NumberInput
                key={key}
                label={label}
                value={strValue}
                onChange={(v) => {
                    if (type === 'number') {
                        updateTab(key, v === '' ? null : (parseInt(v) || 0));
                    } else {
                        updateTab(key, v || null);
                    }
                }}
            />
        );
    };

    return (
        <div>
            <SectionDescription
                title="Tabs"
                description="Styles the Tab component: corner style, borders, padding, fonts, and colors. The Active and Disabled overrides let you change any base value for those states. The bottom area styles the content panel under the tab strip."
            />
            <SectionHeader title="Base Tab Styling" level={0} defaultOpen>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NumberInput label="Corner Style" value={config.tabs.cornerStyle} onChange={(v) => updateTab('cornerStyle', v)} />
                    <NumberInput label="Inner Border" value={config.tabs.innerBorder} onChange={(v) => updateTab('innerBorder', v)} />
                    <NumberInput label="Outer Border" value={config.tabs.outerBorder} onChange={(v) => updateTab('outerBorder', v)} />
                    <NumberInput label="Border Radius" value={config.tabs.borderRadius} onChange={(v) => updateTab('borderRadius', v)} />
                    {renderField('textColor', 'Text Color', 'color')}
                    {renderField('bgColor', 'Background', 'color')}
                    <NumberInput label="Vertical Padding" value={config.tabs.verticalPadding} onChange={(v) => updateTab('verticalPadding', v)} />
                    <NumberInput label="Horizontal Padding" value={config.tabs.horizontalPadding} onChange={(v) => updateTab('horizontalPadding', v)} />
                    <NumberInput label="Font Size" value={config.tabs.fontSize} onChange={(v) => updateTab('fontSize', v)} />
                    <NumberInput label="Font Weight" value={String(config.tabs.fontWeight)} onChange={(v) => updateTab('fontWeight', parseInt(v) || 500)} />
                    <NumberInput label="Line Height" value={config.tabs.lineHeight} onChange={(v) => updateTab('lineHeight', v)} />
                </div>
            </SectionHeader>

            <SectionHeader title="Active Tab Overrides" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {renderField('activeTextColor', 'Text Color', 'color')}
                    {renderField('activeBgColor', 'Background', 'color')}
                    <NumberInput label="Vertical Padding" value={config.tabs.activeVerticalPadding ?? ''} onChange={(v) => updateTab('activeVerticalPadding', v || null)} />
                    <NumberInput label="Horizontal Padding" value={config.tabs.activeHorizontalPadding ?? ''} onChange={(v) => updateTab('activeHorizontalPadding', v || null)} />
                    <NumberInput label="Font Size" value={config.tabs.activeFontSize ?? ''} onChange={(v) => updateTab('activeFontSize', v || null)} />
                    <NumberInput label="Font Weight" value={config.tabs.activeFontWeight !== null ? String(config.tabs.activeFontWeight) : ''} onChange={(v) => updateTab('activeFontWeight', v === '' ? null : (parseInt(v) || 0))} />
                    <NumberInput label="Line Height" value={config.tabs.activeLineHeight ?? ''} onChange={(v) => updateTab('activeLineHeight', v || null)} />
                </div>
            </SectionHeader>

            <SectionHeader title="Disabled Tab Overrides" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {renderField('disabledTextColor', 'Text Color', 'color')}
                    {renderField('disabledBgColor', 'Background', 'color')}
                    <NumberInput label="Vertical Padding" value={config.tabs.disabledVerticalPadding ?? ''} onChange={(v) => updateTab('disabledVerticalPadding', v || null)} />
                    <NumberInput label="Horizontal Padding" value={config.tabs.disabledHorizontalPadding ?? ''} onChange={(v) => updateTab('disabledHorizontalPadding', v || null)} />
                    <NumberInput label="Font Size" value={config.tabs.disabledFontSize ?? ''} onChange={(v) => updateTab('disabledFontSize', v || null)} />
                    <NumberInput label="Font Weight" value={config.tabs.disabledFontWeight !== null ? String(config.tabs.disabledFontWeight) : ''} onChange={(v) => updateTab('disabledFontWeight', v === '' ? null : (parseInt(v) || 0))} />
                    <NumberInput label="Line Height" value={config.tabs.disabledLineHeight ?? ''} onChange={(v) => updateTab('disabledLineHeight', v || null)} />
                </div>
            </SectionHeader>

            <SectionHeader title="Bottom Content Area" level={0}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {renderField('bottomBgColor', 'Background', 'color')}
                    <NumberInput label="Padding Top" value={config.tabs.bottomPaddingTop} onChange={(v) => updateTab('bottomPaddingTop', v)} />
                    <NumberInput label="Padding Bottom" value={config.tabs.bottomPaddingBottom} onChange={(v) => updateTab('bottomPaddingBottom', v)} />
                    <NumberInput label="Padding Left" value={config.tabs.bottomPaddingLeft} onChange={(v) => updateTab('bottomPaddingLeft', v)} />
                    <NumberInput label="Padding Right" value={config.tabs.bottomPaddingRight} onChange={(v) => updateTab('bottomPaddingRight', v)} />
                    <NumberInput label="Border Radius" value={config.tabs.bottomBorderRadius} onChange={(v) => updateTab('bottomBorderRadius', v)} />
                </div>
            </SectionHeader>
        </div>
    );
}
