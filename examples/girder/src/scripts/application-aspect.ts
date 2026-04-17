import { Aspect } from '@reformjs/girder';

class ApplicationAspect extends Aspect {
    constructor() {
        super('application');
    }

    // eslint-disable-next-line class-methods-use-this
    settings() {
        return {
            messagePrint: [
                'Hello World.',
                'How are you!',
            ]
        };
    }

    // eslint-disable-next-line class-methods-use-this
    onStart(context) {
        context.getAspect('messagePrint').print();
    }

    // eslint-disable-next-line class-methods-use-this
    onStop() {
        // eslint-disable-next-line no-console
        console.log('Application context is stopping');
    }
}

export default ApplicationAspect;
