import ReactAspect from '@reformjs/girder-react-aspect/18';
import Page from './components/page';
import stores from './stores';
import serviceDefinitions from './service-definitions';

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('todoApp', Page);
    }

    settings() {
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
