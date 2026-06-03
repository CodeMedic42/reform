interface LibControl {
    start: () => Promise<HarnessControl>;
    stop: () => Promise<unknown>;
}

interface HarnessControl {
    clearHarness: () => Promise<void>;
}

declare const global: Record<string, unknown>;

const initialize = require('@reformjs/web-unit/initialize');

let libControl: LibControl | null = null;
let harnessControl: HarnessControl | null = null;

beforeAll(async () => {
    libControl = await initialize();
    harnessControl = await libControl!.start();
});

beforeEach(async () => {
    global.harnessControl = harnessControl;
});

afterEach(async () => {
    await harnessControl!.clearHarness();
});

afterAll(async () => {
    harnessControl = null;

    await libControl!.stop();
});
