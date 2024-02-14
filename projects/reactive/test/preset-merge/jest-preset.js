/* eslint-disable import/no-extraneous-dependencies */
const tsPreset = require('ts-jest/jest-preset');
const webUnitPreset = require('@reformjs/web-unit-jest/jest-preset');
// const pupPreset = require('jest-puppeteer/jest-preset');
const forEach = require('lodash/forEach');
const isNil = require('lodash/isNil');
const get = require('lodash/get');

const typeLookup = {
    automock: 'value',
    bail: 'value',
    cacheDirectory: 'value',
    clearMocks: 'value',
    collectCoverage: 'value',
    collectCoverageFrom: 'array',
    coverageDirectory: 'value',
    coveragePathIgnorePatterns: 'array',
    coverageProvider: 'value',
    coverageReporters: 'nim',
    coverageThreshold: 'nim',
    dependencyExtractor: 'value',
    displayName: 'nim',
    errorOnDeprecated: 'value',
    extensionsToTreatAsEsm: 'array',
    fakeTimers: 'nim',
    forceCoverageMatch: 'array',
    globals: 'nim',
    globalSetup: 'value',
    globalTeardown: 'value',
    haste: 'nim',
    injectGlobals: 'value',
    maxConcurrency: 'value',
    maxWorkers: 'value',
    moduleDirectories: 'array',
    moduleFileExtensions: 'array',
    moduleNameMapper: 'nim',
    modulePathIgnorePatterns: 'array',
    modulePaths: 'array',
    notify: 'value',
    notifyMode: 'value',
    preset: 'value',
    prettierPath: 'value',
    projects: 'nim',
    reporters: 'nim',
    resetMocks: 'value',
    resetModules: 'value',
    resolver: 'value',
    restoreMocks: 'value',
    rootDir: 'value',
    roots: 'array',
    runner: 'value',
    sandboxInjectedGlobals: 'array',
    setupFiles: 'array',
    setupFilesAfterEnv: 'array',
    showSeed: 'value',
    slowTestThreshold: 'value',
    snapshotFormat: 'nim',
    snapshotResolver: 'value',
    snapshotSerializers: 'array',
    testEnvironment: 'value',
    testEnvironmentOptions: 'nim',
    testFailureExitCode: 'value',
    testMatch: 'array',
    testPathIgnorePatterns: 'array',
    testRegex: 'array',
    testResultsProcessor: 'value',
    testRunner: 'value',
    testSequencer: 'value',
    testTimeout: 'value',
    transform: 'shallowObject',
    transformIgnorePatterns: 'array',
    unmockedModulePathPatterns: 'array',
    verbose: 'value',
    watchPathIgnorePatterns: 'array',
    watchPlugins: 'nim',
    watchman: 'value',
    workerIdleMemoryLimit: ['value'],
    '//': 'value',
};

function presetMerge(presets) {
    const config = {};

    forEach(presets, (preset) => {
        forEach(preset, (value, key) => {
            const type = typeLookup[key];

            if (isNil(type)) {
                throw new Error(`Unknown config key: ${key}`);
            }

            if (type === 'nim') {
                throw new Error(`${key} not implemented`);
            }

            if (type === 'value') {
                config[key] = value;
            } else if (type === 'array') {
                const current = get(config, key, []);

                current.push(...value);

                config[key] = current;
            } else if (type === 'shallowObject') {
                let current = get(config, key, {});

                current = {
                    ...current,
                    ...value,
                };

                config[key] = current;
            }
        });
    });

    return config;
}

// merge all
module.exports = presetMerge([tsPreset, webUnitPreset]);

// load preset merge config

/*
automock "value"
bail [number | boolean]
cacheDirectory "value"
clearMocks "value"
collectCoverage "value"
collectCoverageFrom "array"
coverageDirectory "value"
coveragePathIgnorePatterns "array"
coverageProvider "value"
coverageReporters [array<string | [string, options]>]
coverageThreshold [object]
dependencyExtractor "value"
displayName [string, object]
errorOnDeprecated "value"
extensionsToTreatAsEsm "array"
fakeTimers [object]
forceCoverageMatch "array"
globals [object]
globalSetup "value"
globalTeardown "value"
haste [object]
injectGlobals "value"
maxConcurrency "value"
maxWorkers [number | string]
moduleDirectories "array"
moduleFileExtensions "array"
moduleNameMapper [object<string, string | array<string>>]
modulePathIgnorePatterns "array"
modulePaths "array"
notify "value"
notifyMode "value"
preset "value"
prettierPath "value"
projects [array<string | ProjectConfig>]
reporters [array<moduleName | [moduleName, options]>]
resetMocks "value"
resetModules "value"
resolver "value"
restoreMocks "value"
rootDir "value"
roots "array"
runner "value"
sandboxInjectedGlobals "array"
setupFiles "array"
setupFilesAfterEnv "array"
showSeed "value"
slowTestThreshold "value"
snapshotFormat [object]
snapshotResolver "value"
snapshotSerializers "array"
testEnvironment "value"
testEnvironmentOptions [Object]
testFailureExitCode "value"
testMatch "array"
testPathIgnorePatterns "array"
testRegex [string | array<string>]
testResultsProcessor "value"
testRunner "value"
testSequencer "value"
testTimeout "value"
transform [object<string, pathToTransformer | [pathToTransformer, object]>]

{
    "": "",
    "": ["". {}],
}

transformIgnorePatterns "array"
unmockedModulePathPatterns "array"
verbose "value"
watchPathIgnorePatterns "array"
watchPlugins [array<string | [string, Object]>]
watchman "value"
workerIdleMemoryLimit ["value"]
// "value"
*/
