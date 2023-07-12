/* eslint-disable class-methods-use-this */
import { Aspect } from '@reform/girder-client';

class StoreAspect extends Aspect {
    hooks() {
        return [];
    }

    state() {
        return null;
    }

    dispatch() {

    }

    onInitialize({ setControls }) {
        const controls = {
            getState: (...args) => this.state(...args),
            dispatch: (...args) => this.dispatch(...args),
        };

        setControls(controls);
    }
}

export default StoreAspect;