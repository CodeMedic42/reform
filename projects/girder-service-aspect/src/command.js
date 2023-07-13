import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import mergeConfigs from './merge-configs';

function replaceRouteParams(url, params = {}) {
    const regex = /{(#[a-zA-Z. ]+)?[a-zA-Z. ]+.[a-zA-Z. ]}/g;
    const placeholders = url.match(regex);

    return reduce(placeholders, (acc, placeholder) => {
        const key = placeholder.substring(1, placeholder.length - 1);
        const value = get(params, key, null);

        if (!isNil(value)) {
            acc.replaceAll(placeholder, value);
        }

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

function runHooks(hookList, contextAccess, value) {
    let onGoingValue = value;

    forEach(hookList, (hook) => {
        const result = hook(contextAccess, value);

        onGoingValue = !isNil(result) ? result : onGoingValue;
    });

    return onGoingValue;
}

function runHooksWithHandled(hookList, contextAccess, value) {
    let handled = false;

    forEach(hookList, (hook) => {
        handled = hook(contextAccess, value) || handled;
    });

    return handled;
}

class Command {
    constructor(config = {}) {
        this.config = config;
    }

    build(groupConfig, getContext) {
        const commandConfig = mergeConfigs(
            groupConfig,
            this.config,
        );

        return async (instanceConfiguration) => {
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

            const context = getContext();

            try {
                let finalSettings = settings;

                finalSettings = runHooks(hooks.onBeforeRequest, context, settings);

                finalSettings = buildFinalConfig(finalSettings);

                const instance = axios.create(finalSettings);

                axiosRetry(instance, retry);

                result = await instance.request(settings);

                runHooks(hooks.onSuccess, context, result);
            } catch (caughtError) {
                error = caughtError;

                runHooksWithHandled(hooks.onFailure, context, error);
            }

            const returnValue = [error, result];

            runHooks(hooks.onAfterRequest, context, returnValue);

            return returnValue;
        };
    }
}

export default Command;
