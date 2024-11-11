import { createRoot } from 'react-dom/client';
import ReactAspectBase from './react-aspect-base';

class ReactAspect18 extends ReactAspectBase {
    constructor(aspectId, RootComponent) {
        super(aspectId, RootComponent);

        this.root = null;
        this.mounted = false;
    }

    mount(container, appRoot) {
        if (!this.mounted) {
            this.root = createRoot(container);

            this.root.render(appRoot);
        }
    }

    unmount() {
        if (this.mounted) {
            this.root.unmount();
            this.root = null;
        }
    }
}

export default ReactAspect18;