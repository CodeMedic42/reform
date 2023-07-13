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
    onInitialize({ setControls, getContext, hooks }) {
        const globalConfigurations = [DEFAULT_CONFIG];
        const finalConfigurations = {};

        forEach(hooks.service, (hook) => {
            const {
                globalConfiguration,
                groupConfigurations,
            } = hook;

            if (!isNil(globalConfiguration)) {
                globalConfigurations.push(globalConfiguration);
            }

            forEach(groupConfigurations, (
                groupConfiguration,
                groupConfigurationId,
            ) => {
                if (!isNil(finalConfigurations[groupConfigurationId])) {
                    throw new Error(`A service group configuration already exists with id "${groupConfigurationId}"`);
                }

                finalConfigurations[groupConfigurationId] = groupConfiguration;
            });
        });

        const globalConfiguration = mergeConfigs(...globalConfigurations);

        const controls = mapValues(
            finalConfigurations,
            (groupConfiguration) => groupConfiguration.build(globalConfiguration, getContext),
        );

        setControls(controls);
    }
}

export default ServiceAspect;