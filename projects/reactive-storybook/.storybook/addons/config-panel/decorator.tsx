import React, { useEffect, useRef } from 'react';
import { useChannel } from 'storybook/preview-api';
import AsyncValue from '@reformjs/reactive/workflow/async-value';
import { EVENTS } from './constants';
import { applyColors } from './apply/apply-colors';
import { applyStructural } from './apply/apply-structural';
import { loadPanelState, savePanelState } from './storage';
import type { ConfigState } from './types';

const STRUCTURAL_STYLE_ID = 'ra-config-structural';

function applyConfig(config: ConfigState) {
    applyColors(config);
    applyStructural(config);
}

function waitForStructuralCss(): Promise<boolean> {
    return new Promise((resolve) => {
        if (document.getElementById(STRUCTURAL_STYLE_ID)) {
            resolve(true);
            return;
        }

        const observer = new MutationObserver(() => {
            if (document.getElementById(STRUCTURAL_STYLE_ID)) {
                observer.disconnect();
                resolve(true);
            }
        });

        observer.observe(document.head, { childList: true });
    });
}

function Loading() {
    return (
        <div style={{ padding: '24px', fontSize: '14px', color: '#666' }}>
            Loading styles...
        </div>
    );
}

export function withConfigPanel(Story: React.ComponentType, context: unknown) {
    const appliedRef = useRef(false);

    useChannel({
        [EVENTS.CONFIG_CHANGED]: (config: ConfigState) => {
            applyConfig(config);
        },
        [EVENTS.SEND_CONFIG]: (config: ConfigState) => {
            applyConfig(config);
        },
    });

    // Apply persisted config on initial load, seeding localStorage with defaults if empty
    useEffect(() => {
        if (appliedRef.current) return;
        appliedRef.current = true;

        const panelState = loadPanelState();
        savePanelState(panelState);
        applyConfig(panelState.config);
    }, []);

    const LoadedStory = React.useCallback(
        ({ value }: { value: boolean }) => <Story />,
        [Story],
    );

    return (
        <AsyncValue
            value={waitForStructuralCss}
            LoadingComponent={Loading}
            LoadedComponent={LoadedStory}
        />
    );
}
