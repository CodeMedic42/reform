import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mergeConfigs from './merge-configs';

function replaceRouteParams(url, params = {}) {
    const regex = /(:\w+)/g;
    const placeholders = url.match(regex);

    return reduce(placeholders, (acc, placeholder) => {
        const key = placeholder.substring(1, placeholder.length);
        const value = get(params, key, null);

        if (isNil(value)) {
            throw new Error(`A param with key "${key}" was not found in the routeParams.`);
        }

        // eslint-disable-next-line no-param-reassign
        acc = acc.replaceAll(placeholder, value);

        return acc;
    }, url);
}

function buildFinalConfig(settings) {
    const {
        queryParams,
        routeParams,
        url,
        ...additionalSettings
    } = settings;

    return {
        ...additionalSettings,
        params: queryParams,
        url: replaceRouteParams(url, routeParams),
    };
}

function runHooks(hookList, contextAccess, value, settings) {
    let onGoingValue = value;

    forEach(hookList, (hook) => {
        const result = hook(contextAccess, value, settings);

        onGoingValue = !isNil(result) ? result : onGoingValue;
    });

    return onGoingValue;
}

function runHooksWithHandled(hookList, contextAccess, value, settings) {
    let handled = false;

    forEach(hookList, (hook) => {
        handled = hook(contextAccess, value, settings) || handled;
    });

    return handled;
}

class Command {
    constructor(config = {}) {
        this.config = config;
    }

    build(parentConfiguration, girderContext) {
        const commandConfig = mergeConfigs(
            parentConfiguration,
            this.config,
        );

        return async (instanceConfiguration = {}) => {
            let result = null;
            let error = null;

            const {
                hooks,
                retry,
                ...settings
            } = mergeConfigs(
                commandConfig,
                instanceConfiguration,
            );

            // const context = getContext();

            let finalSettings = settings;

            try {
                finalSettings = runHooks(hooks.onBeforeRequest, girderContext, settings);

                const instanceSettings = buildFinalConfig(finalSettings);

                const instance = axios.create(instanceSettings);

                axiosRetry(instance, retry);

                result = await instance.request(instanceSettings);

                runHooks(hooks.onSuccess, girderContext, result, finalSettings);
            } catch (caughtError) {
                error = caughtError;

                const handled = runHooksWithHandled(hooks.onFailure, girderContext, error, finalSettings);

                if (!handled) {
                    throw caughtError;
                }
            }

            const returnValue = [error, result];

            runHooks(hooks.onAfterRequest, girderContext, returnValue, finalSettings);

            return returnValue;
        };
    }
}

export default Command;
