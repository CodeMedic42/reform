import { createRoot, type Root } from 'react-dom/client';
import type { ReactNode, ComponentType } from 'react';
import ReactAspectBase from './react-aspect-base.js';

class ReactAspect18 extends ReactAspectBase {
    root: Root | null;
    mounted: boolean;

    constructor(aspectId: string, RootComponent: ComponentType) {
        super(aspectId, RootComponent);

        this.root = null;
        this.mounted = false;
    }

    mount(container: HTMLDivElement, appRoot: ReactNode): void {
        if (!this.mounted) {
            this.root = createRoot(container);

            this.root.render(appRoot);
        }
    }

    unmount(): void {
        if (this.mounted) {
            this.root!.unmount();
            this.root = null;
        }
    }
}

export default ReactAspect18;
