import ReactAspect from '@reformjs/girder-react-aspect/18';
import Page from './components/page';
import stores from './stores';

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('todoApp', Page);
    }

    settings() {
        return {
            fluxible: {
                stores,
            }
        };
    }
}

export default ApplicationAspect;
