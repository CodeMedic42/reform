import React, { ReactNode } from 'react';
import {
    provideContext,
} from 'fluxible-addons-react';
import FluxibleAspect from './fluxible-aspect.js';

import type { AspectSettings } from '@reformjs/girder';

const BaseComponent = provideContext(({ children }: { children: ReactNode }) => children);

class FluxibleReactAspect extends FluxibleAspect {
    settings(): AspectSettings | null {
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
