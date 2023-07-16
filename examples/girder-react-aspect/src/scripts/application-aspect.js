import ReactAspect from '@reformjs/girder-react-aspect';
import Increment from './components/increment';

class ApplicationAspect extends ReactAspect {
    constructor() {
        super('application', Increment);
    }
}

export default ApplicationAspect;
