const puppeteer = require('puppeteer');

async function startPuppeteer(runContext, port) {
    const {
        headless = true,
        verbose = false,
    } = runContext.getConfig();

    const browser = await puppeteer.launch({
        headless,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    if (verbose) {
        page.on('console', (msg) => console.log(msg.text()));
    }

    await Promise.all([
        page.coverage.startJSCoverage(),
        page.coverage.startCSSCoverage(),
    ]);

    await page.goto(`http://localhost:${port}`);

    return { browser, page };
}

module.exports = startPuppeteer;
