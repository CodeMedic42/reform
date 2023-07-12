import getElementAttribute from './get-element-attribute';

async function getElementId(elementHandle) {
    return getElementAttribute(elementHandle, 'id');
}

export default getElementId;
