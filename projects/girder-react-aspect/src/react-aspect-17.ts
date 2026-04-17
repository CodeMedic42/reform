/* eslint-disable class-methods-use-this */
// eslint-disable-next-line react/no-deprecated
import ReactDom, { unmountComponentAtNode } from 'react-dom';
import type { ReactNode, ComponentType } from 'react';
import ReactAspectBase from './react-aspect-base.js';

class ReactAspect17 extends ReactAspectBase {
    mounted: boolean;

    constructor(aspectId: string, RootComponent: ComponentType) {
        super(aspectId, RootComponent);

        this.mounted = false;
    }

    mount(container: HTMLDivElement, appRoot: ReactNode): void {
        if (!this.mounted) {
            ReactDom.render(appRoot, container);
        }

        this.mounted = true;
    }

    unmount(container: HTMLDivElement): void {
        if (this.mounted) {
            unmountComponentAtNode(container);
        }

        this.mounted = false;
    }
}

export default ReactAspect17;
