import ReactAspect from '@reformjs/girder-react-aspect';
import Page from './components/page';

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('incrementApp', Page);
    }
}

export default ApplicationAspect;
