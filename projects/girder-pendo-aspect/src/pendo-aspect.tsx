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
            (function(p: Window, e: Document, n: string, d: string, _o?: PendoInstance) {
                var v: string[], w: number, x: number, y: HTMLScriptElement, z: HTMLScriptElement;

                _o = (p as unknown as Record<string, PendoInstance>)[d] = (p as unknown as Record<string, PendoInstance>)[d] || {} as PendoInstance;

                _o._q = [];

                v = ['initialize', 'identify', 'updateOptions', 'pageLoad'];

                for (w = 0, x = v.length; w < x; ++w)
                    (function(m: string) {
                        _o![m] = _o![m] || function() {
                            _o!._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
                        };
                    })(v[w]);

                y = e.createElement(n) as HTMLScriptElement;

                y.async = true;

                y.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;

                z = e.getElementsByTagName(n)[0] as HTMLScriptElement;

                z.parentNode!.insertBefore(y, z);
            })(window, document, 'script', 'pendo');
        })
        .catch((error: Error) => {
            console.error('Failed to setup Pendo');
            console.error(error, error.stack);
        });
    }
}

export default PendoAspect;
