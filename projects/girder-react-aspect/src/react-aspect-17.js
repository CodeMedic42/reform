// eslint-disable-next-line react/no-deprecated
import ReactDom, { unmountComponentAtNode } from 'react-dom';
import ReactAspectBase from './react-aspect-base';

class ReactAspect17 extends ReactAspectBase {
    onStart(systemContext) {
        const appRoot = super.onStart(systemContext);

        ReactDom.render(appRoot, this.container);
    }

    onStop() {
        unmountComponentAtNode(this.container);

        super.stop();
    }
}

export default ReactAspect17;