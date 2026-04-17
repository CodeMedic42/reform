import puppeteer, { Browser, Page } from 'puppeteer';
import type RunContext from '../run-context.js';

interface PuppeteerResult {
    browser: Browser;
    page: Page;
}

async function startPuppeteer(runContext: RunContext, port: number | string): Promise<PuppeteerResult> {
    const {
        headless = true,
        verbose = false,
    } = runContext.getConfig();

    const browser: Browser = await puppeteer.launch({
        headless,
        defaultViewport: null,
    });

    const page: Page = await browser.newPage();

    if (verbose) {
        // eslint-disable-next-line no-console
        page.on('console', (msg) => console.log(msg.text()));
    }

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage(),
    ]);

    await page.goto(`http://localhost:${port}`);

    return { browser, page };
}

export default startPuppeteer;
