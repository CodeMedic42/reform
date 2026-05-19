import { Aspect } from '@reformjs/girder';

interface HelloControls {
    greet: (name: string) => string;
}

class HelloAspect extends Aspect {
    constructor() {
        super('hello');
    }

    onInitialize(): HelloControls {
        return {
            greet: (name: string): string => `Hello ${name}`,
        };
    }
}

export default HelloAspect;
