/* eslint-disable no-console */
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';

class Client {
    constructor() {
        this.aspects = {};
        this.hooks = {};
    }

    registerAspect(aspect) {
        if (this.started) {
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
        try {
            if (this.started) {
                return this;
            }

            const context = {};

            forEach(this.aspects, (aspect, aspectId) => {
                aspect.onInitialize({
                    setControls: (controls) => {
                        context[aspectId] = controls;
                    },
                    getContext: () => {
                        if (!this.started) {
                            throw new Error('The client has not started yet.');
                        }

                        return context;
                    },
                    hooks: this.hooks,
                });
            });

            this.started = true;

            forEach(this.aspects, (aspect) => {
                aspect.onStart(context);
            });
        } catch(error) {
            this.started = false;

            console.error('Failed to start client');

            throw error;
        }

        return this;
    }

    stop() {
        try {
            if (!this.stared) {
                return this;
            }

            forEach(this.aspects, (aspect) => {
                aspect.onStop();
            });

            this.started = false;
        } catch (error) {
            console.error('Failed to stop client');

            throw error;
        }

        return this;
    }
};

export default Client;