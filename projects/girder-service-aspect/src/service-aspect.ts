import { mapValues, isNil, forEach } from 'lodash-es';
import { Aspect, type AspectInitContext } from '@reformjs/girder';
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

    onInitialize(config?: AspectInitContext): Record<string, unknown> {
        const{ getAspect, getSettings } = config!;

        const configurations: ServiceConfig[] = [DEFAULT_CONFIG];
        const finalDefinitions: Record<string, Buildable> = {};

        const settings = getSettings('service') as ServiceSetting[];

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
