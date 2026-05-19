declare module 'puppeteer-to-istanbul' {
    import type { CoverageEntry } from 'puppeteer';

    interface WriteOptions {
        includeHostname?: boolean;
        storagePath?: string;
    }

    interface PuppeteerToIstanbul {
        write(coverage: CoverageEntry[], options?: WriteOptions): void;
    }

    const pti: PuppeteerToIstanbul;
    export default pti;
}
