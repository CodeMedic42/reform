import mapValues from 'lodash/mapValues';
import mergeConfigs from './merge-configs';

class Group {
    constructor({ commands = [], configuration = {}}) {
        this.commands = commands;
        this.configuration = configuration;
    }

    build(globalConfiguration, getContext) {
        const groupConfiguration = mergeConfigs(
            globalConfiguration,
            this.configuration,
        );

        const commands = mapValues(
            this.commands,
            (command) => command.build(groupConfiguration, getContext),
        );

        return commands;
    }
}

export default Group;
