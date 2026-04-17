import { Group } from "@reformjs/girder-service-aspect";
import retrieve from './retrieve.js';
import create from './create.js';
import update from './update.js';
import toggle from './toggle.js';

export default new Group({
    definitions: {
        retrieve,
        create,
        update,
        toggle,
    }
});