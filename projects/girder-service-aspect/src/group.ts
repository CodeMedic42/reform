import mapValues from 'lodash/mapValues';
import mergeConfigs from './merge-configs.js';
import type { ServiceConfig } from './merge-configs.js';

interface Buildable {
    build: (configuration: ServiceConfig, context: unknown) => unknown;
}

interface GroupOptions {
    definitions?: Record<string, Buildable>;
    configuration?: ServiceConfig;
}

class Group {
    definitions: Record<string, Buildable>;
    configuration: ServiceConfig;

    constructor({ definitions = {}, configuration = {}}: GroupOptions) {
        this.definitions = definitions;
        this.configuration = configuration;
    }

    build(parentConfiguration: ServiceConfig, getContext: unknown): Record<string, unknown> {
        const groupConfiguration = mergeConfigs(
            parentConfiguration,
            this.configuration,
        );

        const definitions = mapValues(
            this.definitions,
            (definition: Buildable) => definition.build(groupConfiguration, getContext),
        );

        return definitions;
    }
}

export default Group;
