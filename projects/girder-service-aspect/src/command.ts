import { isNil, forEach, reduce, get } from 'lodash-es';
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import mergeConfigs from './merge-configs.js';
import type { ServiceConfig, MergedConfig, HookFunction, ServiceSettings } from './merge-configs.js';

interface GirderContext {
    getAspect: (aspectId: string) => unknown;
}

interface FinalConfig extends AxiosRequestConfig {
    params?: Record<string, string>;
    url?: string;
}

export type CommandExecutor = (instanceConfiguration?: ServiceConfig) => Promise<[unknown, AxiosResponse | null]>;

function replaceRouteParams(url: string, params: Record<string, string> = {}): string {
    const regex = /(:\w+)/g;
    const placeholders = url.match(regex);

    return reduce(placeholders, (acc: string, placeholder: string) => {
        const key = placeholder.substring(1, placeholder.length);
        const value = get(params, key, null);

        if (isNil(value)) {
            throw new Error(`A param with key "${key}" was not found in the routeParams.`);
        }

        acc = acc.replaceAll(placeholder, value);

        return acc;
    }, url);
}

function buildFinalConfig(settings: ServiceSettings): FinalConfig {
    const {
        queryParams,
        routeParams,
        url,
        ...additionalSettings
    } = settings;

    return {
        ...additionalSettings,
        params: queryParams,
        url: replaceRouteParams(url ?? '', routeParams),
    };
}

function runHooks(hookList: HookFunction[], contextAccess: GirderContext, value: unknown, settings?: ServiceSettings): unknown {
    let onGoingValue = value;

    forEach(hookList, (hook: HookFunction) => {
        const result = hook(contextAccess, value, settings);

        onGoingValue = !isNil(result) ? result : onGoingValue;
    });

    return onGoingValue;
}

function runHooksWithHandled(hookList: HookFunction[], contextAccess: GirderContext, value: unknown, settings?: ServiceSettings): boolean {
    let handled = false;

    forEach(hookList, (hook: HookFunction) => {
        handled = (hook(contextAccess, value, settings) as boolean) || handled;
    });

    return handled;
}

class Command {
    config: ServiceConfig;

    constructor(config: ServiceConfig = {}) {
        this.config = config;
    }

    build(parentConfiguration: ServiceConfig, girderContext: GirderContext): CommandExecutor {
        const commandConfig = mergeConfigs(
            parentConfiguration,
            this.config,
        );

        return async (instanceConfiguration: ServiceConfig = {}): Promise<[unknown, AxiosResponse | null]> => {
            let result: AxiosResponse | null = null;
            let error: unknown = null;

            const {
                hooks,
                retry,
                ...settings
            }: MergedConfig = mergeConfigs(
                commandConfig,
                instanceConfiguration,
            );

            // const context = getContext();

            let finalSettings: ServiceSettings = settings;

            try {
                finalSettings = runHooks(hooks.onBeforeRequest, girderContext, settings) as ServiceSettings;

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

            const returnValue: [unknown, AxiosResponse | null] = [error, result];

            runHooks(hooks.onAfterRequest, girderContext, returnValue, finalSettings);

            return returnValue;
        };
    }
}

export default Command;
