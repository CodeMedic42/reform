import mapValues from 'lodash/mapValues';
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';
import mergeConfigs from './merge-configs.js';
import type { ServiceConfig } from './merge-configs.js';

interface Buildable {
    build: (configuration: ServiceConfig, context: GirderContextAccess) => unknown;
}

interface ServiceSetting {
    configuration?: ServiceConfig;
    definitions?: Record<string, Buildable>;
}

interface GirderContextAccess {
    getAspect: (aspectId: string) => unknown;
}

interface InitConfig {
    getAspect: (aspectId: string) => unknown;
    getSettings: (key: string) => ServiceSetting[];
}

const DEFAULT_CONFIG: ServiceConfig = {
    method: 'get',
    queryParams: {},
    routeParams: {},
    headers: {},
    data: null,
    timeout: 1000,
};

class ServiceAspect extends Aspect {
    constructor() {
        super('service');
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize(config: InitConfig): Record<string, unknown> {
        const{ getAspect, getSettings } = config;

        const configurations: ServiceConfig[] = [DEFAULT_CONFIG];
        const finalDefinitions: Record<string, Buildable> = {};

        const settings = getSettings('service');

        forEach(settings, (setting: ServiceSetting) => {
            const {
                configuration,
                definitions,
            } = setting;

            if (!isNil(configuration)) {
                configurations.push(configuration);
            }

            forEach(definitions, (
                definition: Buildable,
                definitionId: string,
            ) => {
                if (!isNil(finalDefinitions[definitionId])) {
                    throw new Error(`A service definition already exists with id "${definitionId}"`);
                }

                finalDefinitions[definitionId] = definition;
            });
        });

        const finalConfiguration = mergeConfigs(...configurations);

        const controls = mapValues(
            finalDefinitions,
            (definition: Buildable) => definition.build(finalConfiguration, {
                getAspect
            }),
        );

        return controls;
    }
}

export default ServiceAspect;
