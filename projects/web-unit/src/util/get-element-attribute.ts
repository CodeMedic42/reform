import type { ElementHandle } from 'puppeteer';

async function getElementAttribute(elementHandle: ElementHandle, attributeId: string): Promise<unknown> {
    return (await elementHandle.getProperty(attributeId)).jsonValue();
}

export default getElementAttribute;
