import { Aspect } from '@reformjs/girder';

class ControlAspect extends Aspect {
    constructor() {
        super('messagePrint');
    }

    // TODO: Check if static function will work here.
    // eslint-disable-next-line class-methods-use-this
    onInitialize(config) {
        const { getSettings } = config;

        const controls = {
            print: () => {
                getSettings('messagePrint').forEach((messages) => {
                    if (messages == null) {
                        return;
                    }

                    messages.forEach((message) => {
                        // eslint-disable-next-line no-console
                        console.log(message);
                    });
                });
            }
        };

        return Promise.resolve(controls);
    }
}

export default ControlAspect;
