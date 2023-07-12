class ServiceConfiguration {
    constructor({
        globalConfiguration = {},
        groupConfigurations = [],
    }) {
        this.globalConfig = globalConfiguration;
        this.groupConfigs = groupConfigurations;
    }

    get globalConfiguration() {
        return this.globalConfig;
    }

    get groupConfigurations() {
        return this.groupConfigs;
    }
}

export default ServiceConfiguration;
