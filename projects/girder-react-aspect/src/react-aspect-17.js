/* eslint-disable class-methods-use-this */
// eslint-disable-next-line react/no-deprecated
import ReactDom, { unmountComponentAtNode } from 'react-dom';
import ReactAspectBase from './react-aspect-base';

class ReactAspect17 extends ReactAspectBase {
    constructor(aspectId, RootComponent) {
        super(aspectId, RootComponent);

        this.mounted = false;
    }

    mount(container, appRoot) {
        if (!this.mounted) {
            ReactDom.render(appRoot, container);
        }

        this.mounted = true;
    }

    unmount(container) {
        if (this.mounted) {
            unmountComponentAtNode(container);
        }

        this.mounted = false;
    }
}

export default ReactAspect17;