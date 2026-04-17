import { isNil } from 'lodash-es';

function buildId(id, additional) {
    if (isNil(id) || id.length <= 0) {
        return null;
    }
    return `${id}-${additional}`;
}

export { buildId as default };
