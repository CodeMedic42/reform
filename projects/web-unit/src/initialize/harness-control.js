/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
const isNil = require('lodash/isNil');

class HarnessControl {
    constructor(page) {
        this.page = page;
    }

    async renderHarness(harnessId) {
        if (isNil(harnessId)) {
            throw new Error('Must provide a harnessId');
        }

        return this.page.evaluate((serHarnessId) => renderHarness(serHarnessId), harnessId);
    }

    async setProps(props) {
        return this.page.evaluate((serProps) => setProps(serProps), props);
    }

    async clearHarness(keepProps) {
        await this.page.evaluate((serKeepProps) => {
            // eslint-disable-next-line no-console
            console.log(serKeepProps);
            clearHarness(serKeepProps);
        }, keepProps);
    }

    async getHarnessElements() {
        return this.page.$$('body > .web-unit-app-root > .web-unit-harness-root > *');
    }

    async selectFromBody(selector) {
        return this.page.$$(`body ${selector}`);
    }

    async pressKey(key, times) {
        for (let counter = 0; counter < times; counter += 1) {
            // eslint-disable-next-line no-await-in-loop
            await this.page.keyboard.press(key);
        }
    }

    async clickMouse(element, times) {
        for (let counter = 0; counter < times; counter += 1) {
            // eslint-disable-next-line no-await-in-loop
            await element.click();
        }
    }

    getPage() {
        return this.page;
    }
}

module.exports = HarnessControl;
