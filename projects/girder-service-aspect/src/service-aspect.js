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
        const{ getAspect, getSettings } = config;

        const configurations = [DEFAULT_CONFIG];
        const finalDefinitions = {};

        const settings = getSettings('service');

        forEach(settings, (setting) => {
            const {
                configuration,
                definitions,
            } = setting;

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
            (definition) => definition.build(finalConfiguration, {
                getAspect
            }),
        );

        return controls;
    }
}

export default ServiceAspect;