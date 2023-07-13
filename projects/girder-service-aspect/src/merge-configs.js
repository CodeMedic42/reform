import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

function mergeSettings(settings = {}, additionalSettings = {}) {
    const {
        data,
        queryParams = {},
        routeParams = {},
        headers = {},
        ...mergableSettings
    } = settings;

    const {
        data: additionalData,
        queryParams: additionalQueryParams = {},
        routeParams: additionalRouteParams = {},
        headers: additionalHeaders = {},
        ...mergableAdditionalSettings
    } = additionalSettings;

    const mergedSettings = {
        ...mergableSettings,
        ...mergableAdditionalSettings,
        queryParams: {
            ...queryParams,
            ...additionalQueryParams,
        },
        routeParams: {
            ...routeParams,
            ...additionalRouteParams,
        },
        headers: {
            ...headers,
            ...additionalHeaders,
        },
        data: !isUndefined(additionalData) ? additionalData : data,
    };

    return mergedSettings;
}

function mergeHooks(hooks, additionalHooks) {
    forEach(additionalHooks, (additionalHook, hookId) => {
        if (isNil(additionalHook)) {
            return;
        }

        if (isFunction(additionalHook)) {
            hooks[hookId].push(additionalHook);
        } else {
            hooks[hookId].push(...additionalHook);
        }
    });
}

function mergeConfigs(...configs) {
    let settings = {};
    let retry = {};
    const hooks = {
        onBeforeRequest: [],
        onAfterRequest: [],
        onSuccess: [],
        onFailure: [],
    };

    forEach(configs, (config) => {
        const {
            hooks: additionalHooks = {},
            retry: additionalRetry = {},
            ...additionalSettings
        } = config;

        settings = mergeSettings(settings, additionalSettings);

        retry = {
            ...retry,
            ...additionalRetry,
        };

        mergeHooks(hooks, additionalHooks);
    });

    return {
        retry,
        hooks,
        ...settings,
    };
}

export default mergeConfigs;
