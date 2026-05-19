import ReactAspect from '@reformjs/girder-react-aspect/18';
import Page from './components/page';
import stores from './stores';

interface FluxibleSettings {
    fluxible: {
        stores: unknown[];
    };
}

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('todoApp', Page);
    }

    settings(): FluxibleSettings {
        return {
            fluxible: {
                stores,
            }
        };
    }
}

export default ApplicationAspect;
