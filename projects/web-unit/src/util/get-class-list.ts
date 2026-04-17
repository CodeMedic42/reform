import type { ElementHandle } from 'puppeteer';

async function getClassList(elementHandle: ElementHandle): Promise<string[]> {
    return elementHandle.evaluate((el: Element) => [...el.classList]);
}

export default getClassList;
