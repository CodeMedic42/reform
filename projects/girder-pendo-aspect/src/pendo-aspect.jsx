/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable one-var */
/* eslint-disable no-var */
import { Aspect } from '@reformjs/girder';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';

class PendoAspect extends Aspect {
    constructor(apiKey) {
        super('pendo');

        this.apiKey = !isFunction(apiKey)
            ? () => apiKey
            : apiKey;
    }

    // eslint-disable-next-line class-methods-use-this
    onInitialize({ setControls, getContext, hooks }) {
        setControls({
            initialize: (...args) => {
                if (isNil(window.pendo)) {
                    throw new Error('Pendo has not been setup properly.');
                }

                window.pendo.initialize(...args);
            }
        });
    }

    onStart(...args) {
        super.onStart(...args);

        Promise.resolve(this.apiKey())
        .then((apiKey) => {
            (function(p, e, n, d, o) {
                var v, w, x, y, z;

                o = p[d] = p[d] || {};

                o._q = [];

                v = ['initialize', 'identify', 'updateOptions', 'pageLoad'];

                for (w = 0, x = v.length; w < x; ++w)
                    (function(m) {
                        o[m] = o[m] || function() {
                            o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
                        };
                    })(v[w]);

                y = e.createElement(n);

                y.async = !0;

                y.src = `https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;

                z = e.getElementsByTagName(n)[0];

                z.parentNode.insertBefore(y, z);
            })(window, document, 'script', 'pendo');
        })
        .catch((error) => {
            console.error('Failed to setup Pendo');
            console.error(error, error.stack);
        });
    }
}

export default PendoAspect;
