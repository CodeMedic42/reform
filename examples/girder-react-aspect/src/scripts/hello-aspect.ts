import { Aspect } from '@reformjs/girder';

class HelloAspect extends Aspect {
    constructor() {
        super('hello');
    }

    onInitialize() {
        return {
            greet: (name) => `Hello ${name}`,
        };
    }
}

export default HelloAspect;
