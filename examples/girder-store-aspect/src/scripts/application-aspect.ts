import ReactAspect from '@reformjs/girder-react-aspect/18';
import Page from './components/page';
import stores from './stores';

interface ApplicationSettings {
    mobx: {
        stores: typeof stores;
    };
}

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('todoApp', Page);
    }

    settings(): ApplicationSettings {
        return {
            mobx: {
                stores,
            }
        };
    }
}

export default ApplicationAspect;
