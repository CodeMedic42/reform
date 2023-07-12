const pti = require('puppeteer-to-istanbul');
const RunContext = require('./run-context');
const startServer = require('./harness-server/start-server');
const startPuppeteer = require('./harness-server/start-puppeteer');
const HarnessControl = require('./harness-control');

async function initialize() {
    const runContext = new RunContext();

    await runContext.load();

    let server = null;
    let browser = null;
    let page = null;

    return {
        start: async () => {
            server = await startServer(runContext);

            ({ browser, page } = await startPuppeteer(runContext, server.options.port));

            return new HarnessControl(page);
        },
        stop: async () => {
            const [jsCoverage, cssCoverage] = await Promise.all([
                page.coverage.stopJSCoverage(),
                page.coverage.stopCSSCoverage(),
            ]);

            pti.write([
                ...jsCoverage,
                // ...cssCoverage,
            ], { includeHostname: false, storagePath: './.nyc_output' });

            await browser.close();
            await server.stop();

            return [jsCoverage, cssCoverage];
        },
    };
}

module.exports = initialize;
