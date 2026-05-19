interface WebUnitConfig {
    harnesses: string;
    headless: boolean;
    verbose: boolean;
}

const config: WebUnitConfig = {
    harnesses: '../src/**/*.harness.js*',
    headless: false,
    verbose: false,
};

module.exports = config;
