import { Aspect } from '@reformjs/girder';

class ControlAspect extends Aspect {
    constructor() {
        super('messagePrint');
    }

    onInitialize(config) {
        const { hooks } = config;

        const controls = {
            print: () => {
                hooks.forEach((messages) => {
                    if (messages == null) {
                        return;
                    }

                    messages.forEach((message) => {
                        console.log(message);
                    });
                });
            }
        };

        return Promise.resolve(controls);
    }
}

export default ControlAspect;
