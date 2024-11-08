import isNil from 'lodash/isNil';

/* eslint-disable class-methods-use-this */
class Aspect {
    constructor(aspectId) {
        if (isNil(aspectId)) {
            throw new Error('An Aspect must have an id.');
        }

        this.aspectId = aspectId;
    }

    get id() {
        return this.aspectId;
    }

    settings() {
        return null;
    }

    onInitialize() {}

    onStart() {}

    onStop() {}

    getControls() {
        return null;
    }
}

export default Aspect;
