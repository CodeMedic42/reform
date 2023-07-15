import { Aspect } from '@reformjs/girder';

class ApplicationAspect extends Aspect {
    constructor() {
        super('application');
    }

    hooks() {
        return {
            messagePrint: [
                'Hello World.',
                'How are you!',
            ]
        }
    }

    onStart(context) {
        context.messagePrint.print();
    }

    onStop() {
        console.log('Application context is stopping');
    }
}

export default ApplicationAspect;
