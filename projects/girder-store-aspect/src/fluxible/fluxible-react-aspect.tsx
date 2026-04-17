import React, { ReactNode } from 'react';
import {
    provideContext,
} from 'fluxible-addons-react';
import FluxibleAspect from './fluxible-aspect.js';

interface AspectSettings {
    react: Array<{
        Component: React.ComponentType<{ children: ReactNode }>;
    }>;
}

const BaseComponent = provideContext(({ children }: { children: ReactNode }) => children);

class FluxibleReactAspect extends FluxibleAspect {
    settings(): AspectSettings {
        return {
            react: [{
                Component: ({ children }: { children: ReactNode }) => (
                    <BaseComponent context={this.context}>
                        {children}
                    </BaseComponent>
                )
            }]
        };
    }
}

export default FluxibleReactAspect;
