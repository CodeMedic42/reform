const path = require('path');
const isArray = require('lodash/isArray');

const serverPath = 'server-client';
const clientPath = 'harness-client';
const nodeModulesPath = 'node_modules';
const configFileName = 'config.js';

function getPath(rootPath, paths) {
    if (paths.length === 0) {
        return rootPath;
    }

    return path.resolve(rootPath, ...paths);
}

function toArray(value) {
    if (isArray(value)) {
        return value;
    }

    return [value];
}

function normalizeConfig(config) {
    const {
        harnesses,
        headless = true,
        verbose = false,
    } = config;

    return {
        headless,
        verbose,
        harnesses: toArray(harnesses),
    };
}

class RunContext {
    constructor() {
        this.workingDir = process.cwd();
        this.configDir = path.resolve(this.workingDir, '.web-unit');
        this.processDir = __dirname;
    }

    async load() {
        const config = await import(path.resolve(this.configDir, configFileName));

        this.config = normalizeConfig(config);
    }

    fromWorkingDir(...paths) {
        return getPath(this.workingDir, paths);
    }

    fromConfigDir(...paths) {
        return getPath(this.configDir, paths);
    }

    fromProcessDir(...paths) {
        return getPath(this.processDir, paths);
    }

    fromServerDir(...paths) {
        return this.fromProcessDir(serverPath, ...paths);
    }

    fromClientDir(...paths) {
        return this.fromProcessDir(clientPath, ...paths);
    }

    fromNodeModulesDir(...paths) {
        return this.fromWorkingDir(nodeModulesPath, ...paths);
    }

    getConfig() {
        return this.config;
    }
}

module.exports = RunContext;
