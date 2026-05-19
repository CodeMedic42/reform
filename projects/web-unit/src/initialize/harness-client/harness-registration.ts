import React from 'react';

interface HarnessModule {
    default: {
        id: string;
        Harness: React.ComponentType<Record<string, unknown>>;
    };
}

interface RequireContext {
    keys(): string[];
    (key: string): HarnessModule;
}

const harnessContext: RequireContext = '__WEB_UNIT_HARNESS_RESOLUTION__' as unknown as RequireContext;

const harnessCache: Record<string, React.ComponentType<Record<string, unknown>>> = {};

harnessContext.keys().forEach((fileKey: string) => {
    const mod: HarnessModule = harnessContext(fileKey);

    const harness = mod.default;


    harnessCache[harness.id] = harness.Harness;
});

export default function getHarness(harnessId: string): React.ComponentType<Record<string, unknown>> | undefined {
    return harnessCache[harnessId];
}
