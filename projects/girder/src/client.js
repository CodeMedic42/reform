/* eslint-disable no-console */
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import set from 'lodash/set';
import promiseForEach from '@reformjs/toolbox/promise-for-each';

class Client {
    constructor() {
        this.aspects = {};
        this.settings = {};

        this.status = 'stopped';
        this.startingPromise = null;
        this.stoppingPromise = null;
    }

    isRunning() {
        return this.isStarting() || this.isStarted();
    }

    isStarting() {
        return this.status === 'starting';
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
            throw new Error('Cannot register an aspect when the system has already been started.');
        }

        if (!isNil(this.aspects[aspect.id])) {
            throw new Error(`An aspect with the id "${aspect.id}" already exists.`);
        }

        this.aspects[aspect.id] = aspect;

        forEach(aspect.settings(), (setting, settingId) => {
            const aspectSettings = get(this.settings, settingId, []);

            aspectSettings.push(setting);

            set(this.settings, settingId, aspectSettings);
        });

        return this;
    }

    async start() {
        if (this.isRunning()) {
            return this.startingPromise;
        }

        if (this.isStopping()) {
            /* istanbul ignore next */
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
                        getSettings: (settingId) =>  this.settings[settingId] || [],
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
            return Promise.resolve();
        }

        if (this.isStopping()) {
            return this.stoppingPromise;
        }

        const finish = () => {
            this.status = 'stopping';
            this.startingPromise = null;

            return promiseForEach(this.aspects, (aspect) => aspect.onStop())
                .then(() => {

                    this.stoppingPromise = null;

                    this.status = 'stopped';
                })
                .catch((error) => {
                    console.error('Failed to stop client');
                    console.error(error, error.stack);

                    throw error;
                });
            };
        if (this.isStarting()) {
            this.stoppingPromise = this.startingPromise.then(finish);
        } else {
            this.stoppingPromise = finish();
        }

        return this.stoppingPromise;
    }
};

export default Client;