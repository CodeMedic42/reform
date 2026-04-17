import path from 'path';
import isArray from 'lodash/isArray';

const serverPath: string = 'server-client';
const clientPath: string = 'harness-client';
const nodeModulesPath: string = 'node_modules';
const configFileName: string = 'config.js';

interface WebUnitConfig {
    headless: boolean;
    verbose: boolean;
    harnesses: string[];
}

interface RawConfig {
    harnesses: string | string[];
    headless?: boolean;
    verbose?: boolean;
}

function getPath(rootPath: string, paths: string[]): string {
    if (paths.length === 0) {
        return rootPath;
    }

    return path.resolve(rootPath, ...paths);
}

function toArray<T>(value: T | T[]): T[] {
    if (isArray(value)) {
        return value;
    }

    return [value];
}

function normalizeConfig(config: RawConfig): WebUnitConfig {
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
    private workingDir: string;
    private configDir: string;
    private processDir: string;
    private config!: WebUnitConfig;

    constructor() {
        this.workingDir = process.cwd();
        this.configDir = path.resolve(this.workingDir, '.web-unit');
        this.processDir = __dirname;
    }

    async load(): Promise<void> {
        const config = await import(path.resolve(this.configDir, configFileName));

        this.config = normalizeConfig(config);
    }

    fromWorkingDir(...paths: string[]): string {
        return getPath(this.workingDir, paths);
    }

    fromConfigDir(...paths: string[]): string {
        return getPath(this.configDir, paths);
    }

    fromProcessDir(...paths: string[]): string {
        return getPath(this.processDir, paths);
    }

    fromServerDir(...paths: string[]): string {
        return this.fromProcessDir(serverPath, ...paths);
    }

    fromClientDir(...paths: string[]): string {
        return this.fromProcessDir(clientPath, ...paths);
    }

    fromNodeModulesDir(...paths: string[]): string {
        return this.fromWorkingDir(nodeModulesPath, ...paths);
    }

    getConfig(): WebUnitConfig {
        return this.config;
    }
}

export default RunContext;
