import pti from 'puppeteer-to-istanbul';
import type { Browser, Page, CoverageEntry } from 'puppeteer';
import type WebpackDevServer from 'webpack-dev-server';
import RunContext from './run-context.js';
import startServer from './harness-server/start-server.js';
import startPuppeteer from './harness-server/start-puppeteer.js';
import HarnessControl from './harness-control.js';

interface InitializeResult {
    start: () => Promise<HarnessControl>;
    stop: () => Promise<[CoverageEntry[], CoverageEntry[]]>;
}

async function initialize(): Promise<InitializeResult> {
    const runContext = new RunContext();

    await runContext.load();

    let server: WebpackDevServer | null = null;
    let browser: Browser | null = null;
    let page: Page | null = null;

    return {
        start: async (): Promise<HarnessControl> => {
            server = await startServer(runContext);

            ({ browser, page } = await startPuppeteer(runContext, (server as any).options.port));

            return new HarnessControl(page!);
        },
        stop: async (): Promise<[CoverageEntry[], CoverageEntry[]]> => {
            const [jsCoverage, cssCoverage] = await Promise.all([
                page!.coverage.stopJSCoverage(),
                page!.coverage.stopCSSCoverage(),
            ]);

            pti.write([
                ...jsCoverage,
                // ...cssCoverage,
            ], { includeHostname: false, storagePath: './.nyc_output' });

            await browser!.close();
            await (server as any).stop();

            return [jsCoverage, cssCoverage];
        },
    };
}

export default initialize;
