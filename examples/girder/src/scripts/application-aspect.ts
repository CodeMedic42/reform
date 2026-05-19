import { Aspect, AspectSettings, AspectStartContext } from '@reformjs/girder';

class ApplicationAspect extends Aspect {
    constructor() {
        super('application');
    }

    settings(): AspectSettings | null {
        return {
            messagePrint: [
                'Hello World.',
                'How are you!',
            ]
        };
    }

    onStart(context?: AspectStartContext): void {
        (context!.getAspect('messagePrint') as { print: () => void }).print();
    }

    onStop(): void {
        console.log('Application context is stopping');
    }
}

export default ApplicationAspect;
