/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
class Aspect {
    constructor(aspectId) {
        this.aspectId = aspectId;
    }

    get id() {
        return this.aspectId;
    }

    hooks() {
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
