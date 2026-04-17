import { isNil } from 'lodash-es';

function getDefaultSize(size) {
    return !isNil(size) ? size : 'md';
}

export { getDefaultSize };
