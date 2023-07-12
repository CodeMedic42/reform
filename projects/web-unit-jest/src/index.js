const initialize = require('@reformjs/web-unit/initialize');

let libControl = null;
let harnessControl = null;

beforeAll(async () => {
    libControl = await initialize();
    harnessControl = await libControl.start();
});

beforeEach(async () => {
    global.harnessControl = harnessControl;
});

afterEach(async () => {
    await harnessControl.clearHarness();
});

afterAll(async () => {
    harnessControl = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const coverage = await libControl.stop();
});
