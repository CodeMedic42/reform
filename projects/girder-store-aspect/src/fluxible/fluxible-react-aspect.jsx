import React from 'react';
import {
    provideContext,
} from 'fluxible-addons-react';
import FluxibleAspect from './fluxible-aspect';

const BaseComponent = provideContext(({children}) => children);

class FluxibleReactAspect extends FluxibleAspect {
    settings() {
        return {
            react: [{
                // eslint-disable-next-line react/prop-types
                Component: ({ children }) => (
                    <BaseComponent context={this.context}>
                        {children}
                    </BaseComponent>
                )
            }]
        };
    }
}

export default FluxibleReactAspect;