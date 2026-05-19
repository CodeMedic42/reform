import type { ElementHandle } from 'puppeteer';

async function getInnerText(elementHandle: ElementHandle): Promise<string> {
    return elementHandle.evaluate((el: Element) => (el as HTMLElement).innerText);
}

export default getInnerText;
