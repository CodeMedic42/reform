async function getElementAttribute(elementHandle, attributeId) {
    return (await elementHandle.getProperty(attributeId)).jsonValue();
}

export default getElementAttribute;
