import mapValues from 'lodash/mapValues';
import mergeConfigs from './merge-configs';

class Group {
    constructor({ definitions = {}, configuration = {}}) {
        this.definitions = definitions;
        this.configuration = configuration;
    }

    build(parentConfiguration, getContext) {
        const groupConfiguration = mergeConfigs(
            parentConfiguration,
            this.configuration,
        );

        const definitions = mapValues(
            this.definitions,
            (definition) => definition.build(groupConfiguration, getContext),
        );

        return definitions;
    }
}

export default Group;
