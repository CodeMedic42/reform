import type { ElementHandle } from 'puppeteer';
import getElementAttribute from './get-element-attribute.js';

async function getElementId(elementHandle: ElementHandle): Promise<unknown> {
    return getElementAttribute(elementHandle, 'id');
}

export default getElementId;
