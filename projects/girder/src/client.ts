import { isNil, forEach, get, set } from 'lodash-es';
import promiseForEach from '@reformjs/toolbox/promise-for-each';
import Aspect, { AspectInitContext } from './aspect.js';

type ClientStatus = 'stopped' | 'starting' | 'started' | 'stopping';

interface AspectMap {
    [aspectId: string]: Aspect;
}

interface SettingsMap {
    [settingId: string]: unknown[];
}

interface ClientContext {
    [aspectId: string]: unknown;
}

class Client {
    private aspects: AspectMap;

    private settings: SettingsMap;

    private status: ClientStatus;

    private startingPromise: Promise<void> | null;

    private stoppingPromise: Promise<void> | null;

    constructor() {
        this.aspects = {};
        this.settings = {};

        this.status = 'stopped';
        this.startingPromise = null;
        this.stoppingPromise = null;
    }

    isRunning(): boolean {
        return this.isStarting() || this.isStarted();
    }

    isStarting(): boolean {
        return this.status === 'starting';
    }

    isStarted(): boolean {
        return this.status === 'started';
    }

    isStopping(): boolean {
        return this.status === 'stopping';
    }

    isStopped(): boolean {
        return this.status === 'stopped';
    }

    registerAspect(aspect: Aspect): this {
        if (this.isRunning()) {
            throw new Error('Cannot register an aspect when the system has already been started.');
        }

        if (!isNil(this.aspects[aspect.id])) {
            throw new Error(`An aspect with the id "${aspect.id}" already exists.`);
        }

        this.aspects[aspect.id] = aspect;

        forEach(aspect.settings(), (setting: unknown, settingId: string) => {
            const aspectSettings: unknown[] = get(this.settings, settingId, []);

            aspectSettings.push(setting);

            set(this.settings, settingId, aspectSettings);
        });

        return this;
    }

    async start(): Promise<void> {
        if (this.isRunning()) {
            return this.startingPromise as Promise<void>;
        }

        if (this.isStopping()) {
            /* istanbul ignore next */
            throw new Error('Client in a stopping state, please wait for that to complete before starting again.');
        }

        this.status = 'starting';

        this.startingPromise = Promise.resolve()
            .then(() => {
                const clientContext: ClientContext = {};

                const getAspect = (aspectId: string): unknown => {
                    if (!this.isStarted()) {
                        throw new Error('The client has not started yet.');
                    }

                    return clientContext[aspectId];
                };

                return promiseForEach(this.aspects, (aspect: Aspect, aspectId: string | number) =>
                    Promise.resolve(aspect.onInitialize({
                        getAspect,
                        getSettings: (settingId: string): unknown[] => this.settings[settingId] || [],
                        stopClient: () => this.stop(),
                    } as AspectInitContext))
                    .then((controls: unknown) => {
                        if (!isNil(controls)) {
                            clientContext[aspectId] = controls;
                        }
                    }))
                .then(() => {
                    this.status = 'started';

                    forEach(this.aspects, (aspect: Aspect) => {
                        aspect.onStart({
                            getAspect,
                            ...clientContext,
                        });
                    });
                }).catch((error: Error) => {
                    this.status = 'stopped';

                    console.error('Failed to start client');
                    console.log(error, error.stack);

                    throw error;
                });
            });

        return this.startingPromise;
    }

    stop(): Promise<void> {
        if (this.isStopped()) {
            return Promise.resolve();
        }

        if (this.isStopping()) {
            return this.stoppingPromise as Promise<void>;
        }

        const finish = (): Promise<void> => {
            this.status = 'stopping';
            this.startingPromise = null;

            return promiseForEach(this.aspects, (aspect: Aspect) => aspect.onStop())
                .then(() => {

                    this.stoppingPromise = null;

                    this.status = 'stopped';
                })
                .catch((error: Error) => {
                    console.error('Failed to stop client');
                    console.error(error, error.stack);

                    throw error;
                });
            };
        if (this.isStarting()) {
            this.stoppingPromise = (this.startingPromise as Promise<void>).then(finish);
        } else {
            this.stoppingPromise = finish();
        }

        return this.stoppingPromise;
    }
}

export default Client;
