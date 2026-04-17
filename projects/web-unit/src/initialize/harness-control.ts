/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
import isNil from 'lodash/isNil';
import type { Page, ElementHandle } from 'puppeteer';

declare function renderHarness(harnessId: string): void;
declare function setProps(props: Record<string, unknown>): void;
declare function clearHarness(keepProps?: boolean): void;

class HarnessControl {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async renderHarness(harnessId: string): Promise<void> {
        if (isNil(harnessId)) {
            throw new Error('Must provide a harnessId');
        }

        return this.page.evaluate((serHarnessId: string) => renderHarness(serHarnessId), harnessId);
    }

    async setProps(props: Record<string, unknown>): Promise<void> {
        return this.page.evaluate((serProps: Record<string, unknown>) => setProps(serProps), props);
    }

    async clearHarness(keepProps?: boolean): Promise<void> {
        await this.page.evaluate((serKeepProps?: boolean) => {
            // eslint-disable-next-line no-console
            console.log(serKeepProps);
            clearHarness(serKeepProps);
        }, keepProps);
    }

    async getHarnessElements(): Promise<ElementHandle[]> {
        return this.page.$$('body > .web-unit-app-root > .web-unit-harness-root > *');
    }

    async selectFromBody(selector: string): Promise<ElementHandle[]> {
        return this.page.$$(`body ${selector}`);
    }

    async pressKey(key: string, times: number): Promise<void> {
        for (let counter = 0; counter < times; counter += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.page.keyboard.press(key as any);
        }
    }

    async clickMouse(element: ElementHandle, times: number): Promise<void> {
        for (let counter = 0; counter < times; counter += 1) {
            // eslint-disable-next-line no-await-in-loop
            await element.click();
        }
    }

    getPage(): Page {
        return this.page;
    }
}

export default HarnessControl;
