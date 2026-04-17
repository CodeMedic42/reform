import forEach from 'lodash/forEach';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

export interface ServiceSettings {
    data?: unknown;
    queryParams?: Record<string, string>;
    routeParams?: Record<string, string>;
    headers?: Record<string, string>;
    url?: string;
    method?: string;
    timeout?: number;
    [key: string]: unknown;
}

export type HookFunction = (contextAccess: unknown, value: unknown, settings?: ServiceSettings) => unknown;

export interface HooksConfig {
    onBeforeRequest?: HookFunction | HookFunction[];
    onAfterRequest?: HookFunction | HookFunction[];
    onSuccess?: HookFunction | HookFunction[];
    onFailure?: HookFunction | HookFunction[];
    [key: string]: HookFunction | HookFunction[] | undefined;
}

export interface ResolvedHooks {
    onBeforeRequest: HookFunction[];
    onAfterRequest: HookFunction[];
    onSuccess: HookFunction[];
    onFailure: HookFunction[];
    [key: string]: HookFunction[];
}

export interface RetryConfig {
    [key: string]: unknown;
}

export interface ServiceConfig extends ServiceSettings {
    hooks?: HooksConfig;
    retry?: RetryConfig;
}

export interface MergedConfig extends ServiceSettings {
    retry: RetryConfig;
    hooks: ResolvedHooks;
}

function mergeSettings(settings: ServiceSettings = {}, additionalSettings: ServiceSettings = {}): ServiceSettings {
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

    const mergedSettings: ServiceSettings = {
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

function mergeHooks(hooks: ResolvedHooks, additionalHooks: HooksConfig): void {
    forEach(additionalHooks, (additionalHook: HookFunction | HookFunction[] | undefined, hookId: string) => {
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

function mergeConfigs(...configs: ServiceConfig[]): MergedConfig {
    let settings: ServiceSettings = {};
    let retry: RetryConfig = {};
    const hooks: ResolvedHooks = {
        onBeforeRequest: [],
        onAfterRequest: [],
        onSuccess: [],
        onFailure: [],
    };

    forEach(configs, (config: ServiceConfig) => {
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
