import { Group } from "@reformjs/girder-service-aspect";
import retrieve from './retrieve';
import create from './create';
import update from './update';
import toggle from './toggle';

export default new Group({
    definitions: {
        retrieve,
        create,
        update,
        toggle,
    }
});
