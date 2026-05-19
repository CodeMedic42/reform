import ReactAspect from '@reformjs/girder-react-aspect/18';
import Page from './components/page';
import stores from './stores';
import serviceDefinitions from './service-definitions';

interface ApplicationSettings {
    mobx: {
        stores: typeof stores;
    };
    service: {
        definitions: typeof serviceDefinitions;
        configuration: {
            baseURL: string;
        };
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
            },
            service: {
                definitions: serviceDefinitions,
                configuration: {
                    baseURL: 'http://localhost:3000/'
                },
            },
        };
    }
}

export default ApplicationAspect;
