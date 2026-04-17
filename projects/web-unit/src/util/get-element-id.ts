import getElementAttribute from './get-element-attribute.js';

async function getElementId(elementHandle) {
    return getElementAttribute(elementHandle, 'id');
}

export default getElementId;
