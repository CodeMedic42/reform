/* eslint-disable no-console */
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';
import promiseForEach from '@reformjs/toolbox/promise-for-each';

class Client {
    constructor() {
        this.aspects = {};
        this.hooks = {};

        this.status = 'stopped';
        this.startingPromise = null;
        this.stoppingPromise = null;
    }

    isRunning() {
        return this.status === 'starting' || this.status === 'started';
    }

    isStarted() {
        return this.status === 'started';
    }

    isStopping() {
        return this.status === 'stopping';
    }

    isStopped() {
        return this.status === 'stopped';
    }

    registerAspect(aspect) {
        if (this.isRunning()) {
            throw new Error('Cannot register an aspect when the system has already been started');
        }

        if (!isNil(this.aspects[aspect.id])) {
            throw new Error(`An aspect with the iud ${aspect.id} already exists`);
        }

        this.aspects[aspect.id] = aspect;

        forEach(aspect.hooks?.(), (hook, hookId) => {
            const aspectHooks = get(this.hooks, hookId, []);

            aspectHooks.push(hook);

            set(this.hooks, hookId, aspectHooks);
        });

        return this;
    }

    async start() {
        if (this.isRunning()) {
            return this.startingPromise;
        }

        if (this.isStopping()) {
            throw new Error('Client in a stopping state, please wait for that to complete before starting again.');
        }

        this.status = 'starting';

        this.startingPromise = Promise.resolve()
            .then(() => {
                const clientContext = {};

                return promiseForEach(this.aspects, (aspect, aspectId) =>
                    Promise.resolve(aspect.onInitialize({
                        getContext: () => {
                            if (!this.isStarted()) {
                                throw new Error('The client has not started yet.');
                            }

                            return clientContext;
                        },
                        hooks: this.hooks[aspectId] || [],
                        stopClient: () => this.stop(),
                    }))
                    .then((controls) => {
                        if (!isNil(controls)) {
                            clientContext[aspectId] = controls;
                        }
                    }))
                .then(() => {
                    this.status = 'started';

                    forEach(this.aspects, (aspect) => {
                        aspect.onStart(clientContext);
                    });
                }).catch((error) => {
                    this.status = 'stopped';

                    console.error('Failed to start client');
                    console.log(error, error.stack);

                    throw error;
                });
            });

        return this.startingPromise;
    }

    stop() {
        if (this.isStopped()) {
            return null;
        }

        if (this.isStopping()) {
            return this.stoppingPromise;
        }

        this.startingPromise = null;

        this.status = 'stopping';

        this.stoppingPromise = promiseForEach(this.aspects, (aspect) => aspect.onStop())
            .then(() => {

                this.stoppingPromise = null;

                this.status = 'stopped';
            })
            .catch((error) => {
                console.error('Failed to stop client');
                console.error(error, error.stack);

                throw error;
            });

        return this.stoppingPromise;
    }
};

export default Client;