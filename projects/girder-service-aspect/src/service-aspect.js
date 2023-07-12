import mapValues from 'lodash/mapValues';
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import { Aspect } from '@reform/girder-client';
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

    applyGlobalConfiguration(globalConfiguration) {
        if (!isNil(globalConfiguration)) {
            this.globalConfigurations.push(globalConfiguration);
        };
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize({ setControls, getContext, hooks }) {
        const globalConfigurations = [DEFAULT_CONFIG];
        const groupConfigurations = {};

        forEach(hooks.service, (hook) => {
            const { configuration } = hook;

            if (isNil(configuration)) {
                return;
            }

            globalConfigurations.push(configuration.globalConfiguration);

            forEach(configuration.groupConfigurations, (
                groupConfiguration,
                groupConfigurationId,
            ) => {
                if (!isNil(groupConfigurations[groupConfigurationId])) {
                    throw new Error(`A service group configuration already exists with id "${groupConfigurationId}"`);
                }

                groupConfigurations[groupConfigurationId] = groupConfiguration;
            });
        });

        const globalConfiguration = mergeConfigs(...globalConfigurations);

        const controls = mapValues(
            groupConfigurations,
            (groupConfiguration) => groupConfiguration.build(globalConfiguration, getContext),
        );

        setControls(controls);
    }
}

export default ServiceAspect;