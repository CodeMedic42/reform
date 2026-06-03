import { Aspect } from '@reformjs/girder';
import type { AspectInitContext, AspectStartContext } from '@reformjs/girder';
import { isFunction, isNil } from 'lodash-es';

interface PendoInstance {
    initialize: (...args: unknown[]) => void;
    _q: unknown[];
    [method: string]: unknown;
}

declare global {
    interface Window {
        pendo?: PendoInstance;
    }
}

type ApiKeyResolver = () => string | Promise<string>;

interface PendoControls {
    initialize: (...args: unknown[]) => void;
}

class PendoAspect extends Aspect {
    private apiKey: ApiKeyResolver;

    constructor(apiKey: string | ApiKeyResolver) {
        super('pendo');

        this.apiKey = !isFunction(apiKey)
            ? () => apiKey as string
            : apiKey as ApiKeyResolver;
    }

    onInitialize(_context?: AspectInitContext): PendoControls {
        return {
            initialize: (...args: unknown[]): void => {
                if (isNil(window.pendo)) {
                    throw new Error('Pendo has not been setup properly.');
                }

                window.pendo.initialize(...args);
            }
        };
    }

    onStart(...args: [AspectStartContext?]): void {
        super.onStart(...args);

        Promise.resolve(this.apiKey())
        .then((apiKey: string) => {
            const installPendo = (p: Window, e: Document, n: string, d: string): void => {
                const globalScope = p as unknown as Record<string, PendoInstance>;
                const pendoInstance: PendoInstance = globalScope[d] || ({} as PendoInstance);
                globalScope[d] = pendoInstance;

                pendoInstance._q = [];

                const methods = ['initialize', 'identify', 'updateOptions', 'pageLoad'];

                methods.forEach((methodName: string) => {
                    pendoInstance[methodName] = pendoInstance[methodName] || function pendoMethod(...callArgs: unknown[]) {
                        (pendoInstance._q[methodName === methods[0] ? 'unshift' : 'push'] as (item: unknown[]) => void)([methodName].concat([].slice.call(callArgs, 0)));
                    };
                });

                const script = e.createElement(n) as HTMLScriptElement;
                script.async = true;
                script.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;

                const firstScript = e.getElementsByTagName(n)[0] as HTMLScriptElement;
                firstScript.parentNode!.insertBefore(script, firstScript);
            };

            installPendo(window, document, 'script', 'pendo');
        })
        .catch((error: Error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to setup Pendo');
            // eslint-disable-next-line no-console
            console.error(error, error.stack);
        });
    }
}

export default PendoAspect;
