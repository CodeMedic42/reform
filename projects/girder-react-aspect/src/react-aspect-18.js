import { createRoot } from 'react-dom/client';
import ReactAspectBase from './react-aspect-base';

class ReactAspect18 extends ReactAspectBase {
    onStart(systemContext) {
        const appRoot = super.onStart(systemContext);

        this.root = createRoot(this.container);

        this.root.render(appRoot);
    }

    onStop() {
        this.root.unmount();
        this.root = null;

        super.stop();
    }
}

export default ReactAspect18;