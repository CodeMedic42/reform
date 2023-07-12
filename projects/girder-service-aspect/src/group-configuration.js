import mapValues from 'lodash/mapValues';
import mergeConfigs from './merge-configs';

class GroupConfiguration {
    constructor(commandConfigs = [], groupConfiguration = {}) {
        this.commandConfigs = commandConfigs;
        this.groupConfiguration = groupConfiguration;
    }

    build(globalConfiguration, getContext) {
        const groupConfiguration = mergeConfigs(
            globalConfiguration,
            this.groupConfiguration,
        );

        const commands = mapValues(
            this.commandConfigs,
            (commandConfig) => commandConfig.build(groupConfiguration, getContext),
        );

        return commands;
    }
}

export default GroupConfiguration;
