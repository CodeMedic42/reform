const tsPreset: Record<string, unknown> = require('ts-jest/jest-preset');
const webUnitPreset: Record<string, unknown> = require('@reformjs/web-unit-jest/jest-preset');
// const pupPreset = require('jest-puppeteer/jest-preset');
const forEach: typeof import('lodash/forEach') = require('lodash/forEach');
const isNil: typeof import('lodash/isNil') = require('lodash/isNil');
const get: typeof import('lodash/get') = require('lodash/get');

type MergeType = 'value' | 'array' | 'shallowObject' | 'nim';

const typeLookup: Record<string, MergeType | MergeType[]> = {
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

function presetMerge(presets: Record<string, unknown>[]): Record<string, unknown> {
    const config: Record<string, unknown> = {};

    forEach(presets, (preset: Record<string, unknown>) => {
        forEach(preset, (value: unknown, key: string) => {
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
                const current: unknown[] = (config[key] as unknown[] | undefined) ?? [];

                current.push(...(value as unknown[]));

                config[key] = current;
            } else if (type === 'shallowObject') {
                let current: Record<string, unknown> = (config[key] as Record<string, unknown> | undefined) ?? {};

                current = {
                    ...current,
                    ...(value as Record<string, unknown>),
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
