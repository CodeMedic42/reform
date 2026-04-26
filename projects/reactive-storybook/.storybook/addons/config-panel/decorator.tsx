import React, { useEffect, useRef } from 'react';
import { useChannel } from 'storybook/preview-api';
import { EVENTS, STORAGE_KEY } from './constants';
import { applyColors } from './apply/apply-colors';
import { applyStructural } from './apply/apply-structural';
import type { ConfigState } from './types';

function applyConfig(config: ConfigState) {
    applyColors(config);
    applyStructural(config);
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

    // Apply persisted config on initial load
    useEffect(() => {
        if (appliedRef.current) return;
        appliedRef.current = true;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const config = JSON.parse(stored) as ConfigState;
                applyConfig(config);
            }
        } catch {
            // ignore
        }
    }, []);

    return <Story />;
}
