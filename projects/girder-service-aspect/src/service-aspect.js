import mapValues from 'lodash/mapValues';
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';
import mergeConfigs from './merge-configs';

const DEFAULT_CONFIG = {
    method: 'get',
    query: {},
    params: {},
    headers: {},
    data: null,
    timeout: 1000,
};

class ServiceAspect extends Aspect {
    constructor() {
        super('service');
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize(config) {
        const{ getContext, hooks } = config;

        const globalConfigurations = [DEFAULT_CONFIG];
        const finalDefinitions = {};

        forEach(hooks, (hook) => {
            const {
                globalConfiguration,
                groupDefinitions,
            } = hook;

            if (!isNil(globalConfiguration)) {
                globalConfigurations.push(globalConfiguration);
            }

            forEach(groupDefinitions, (
                groupDefinition,
                groupDefinitionId,
            ) => {
                if (!isNil(finalDefinitions[groupDefinitionId])) {
                    throw new Error(`A service group definition already exists with id "${groupDefinitionId}"`);
                }

                finalDefinitions[groupDefinitionId] = groupDefinition;
            });
        });

        const globalConfiguration = mergeConfigs(...globalConfigurations);

        const controls = mapValues(
            finalDefinitions,
            (groupConfiguration) => groupConfiguration.build(globalConfiguration, getContext),
        );

        return {
            controls
        };
    }
}

export default ServiceAspect;