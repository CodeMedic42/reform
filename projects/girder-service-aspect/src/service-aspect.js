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

        const configurations = [DEFAULT_CONFIG];
        const finalDefinitions = {};

        forEach(hooks, (hook) => {
            const {
                configuration,
                definitions,
            } = hook;

            if (!isNil(configuration)) {
                configurations.push(configuration);
            }

            forEach(definitions, (
                definition,
                definitionId,
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
            (definition) => definition.build(finalConfiguration, getContext),
        );

        return {
            controls
        };
    }
}

export default ServiceAspect;