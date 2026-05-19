import { isFunction } from 'lodash-es';
import Client from './client.js';
import Aspect, { type AspectInitContext, type AspectStartContext } from './aspect.js';

describe('Client', () => {
    describe('Constructor', () => {
        test('Create', () => {
            const client = new Client();

            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(true);
        });
    });

    test('Start and stop', async () => {
        const client = new Client();

        const promise = client.start().then(() => {
            expect(client.isRunning()).toBe(true);
            expect(client.isStarted()).toBe(true);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(false);

            const stopPromise = client.stop();

            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(true);
            expect(client.isStopped()).toBe(false);

            return stopPromise;
        }).then(() => {
            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(true);
        });

        expect(client.isRunning()).toBe(true);
        expect(client.isStarted()).toBe(false);
        expect(client.isStopping()).toBe(false);
        expect(client.isStopped()).toBe(false);

        return promise;
    });

    test('Starting and stop', async () => {
        const client = new Client();

        let calledFirst = false;

        const startPromise = client.start().then(() => {
            calledFirst = true;
        });

        const stopPromise = client.stop().then(() => {
            expect(calledFirst).toBeTruthy();
        });

        return Promise.all([startPromise, stopPromise]);
    });

    test('Start and start', async () => {
        const client = new Client();

        const proms: Promise<void>[] = [];

        const promiseA = client.start().then(() => {
            expect(client.isRunning()).toBe(true);
            expect(client.isStarted()).toBe(true);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(false);

            const stopPromise = client.stop();

            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(true);
            expect(client.isStopped()).toBe(false);

            return stopPromise;
        });

        proms.push(promiseA);

        const promiseB = client.start().then(() => {
            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(true);
            expect(client.isStopped()).toBe(false);
        });

        proms.push(promiseB);

        expect(client.isRunning()).toBe(true);
        expect(client.isStarted()).toBe(false);
        expect(client.isStopping()).toBe(false);
        expect(client.isStopped()).toBe(false);

        return Promise.all(proms);
    });

    test('stop', async () => {
        const client = new Client();

        expect(client.isRunning()).toBe(false);
        expect(client.isStarted()).toBe(false);
        expect(client.isStopping()).toBe(false);
        expect(client.isStopped()).toBe(true);

        const promise = client.stop().then(() => {
            expect(client.isRunning()).toBe(false);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(true);
        });

        return promise;
    });

    test('stop twice', async () => {
        const client = new Client();

        let calledFirst = false;

        return client.start().then(() => {
            client.stop().then(() => {
                calledFirst = true;
            });

            return client.stop().then(() => {
                expect(calledFirst).toBeTruthy();
            });
        });
    });

    test('Duplicate Aspect id', async () => {
        const client = new Client();

        const foo1 = new Aspect('foo');
        const foo2 = new Aspect('foo');

        const promise = client.registerAspect(foo1);

        const toThrow = (): void => { client.registerAspect(foo2); };

        expect(toThrow).toThrow('An aspect with the id "foo" already exists.');

        return promise;
    });

    test('Register Aspect after start', async () => {
        const client = new Client();

        client.start();

        const toThrow = (): void => { client.registerAspect(new Aspect('foo')); };

        expect(toThrow).toThrow('Cannot register an aspect when the system has already been started.');
    });

    describe('With Aspects', () => {
        test('Start and stop', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');

            client.registerAspect(fooAspect);

            const promise = client.start().then(() => {
                expect(client.isRunning()).toBe(true);
                expect(client.isStarted()).toBe(true);
                expect(client.isStopping()).toBe(false);
                expect(client.isStopped()).toBe(false);

                const stopPromise = client.stop();

                expect(client.isRunning()).toBe(false);
                expect(client.isStarted()).toBe(false);
                expect(client.isStopping()).toBe(true);
                expect(client.isStopped()).toBe(false);

                return stopPromise;
            }).then(() => {
                expect(client.isRunning()).toBe(false);
                expect(client.isStarted()).toBe(false);
                expect(client.isStopping()).toBe(false);
                expect(client.isStopped()).toBe(true);
            });

            expect(client.isRunning()).toBe(true);
            expect(client.isStarted()).toBe(false);
            expect(client.isStopping()).toBe(false);
            expect(client.isStopped()).toBe(false);

            return promise;
        });

        test('onInitialize basic call', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');
            const barAspect = new Aspect('bar');

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation((context?: AspectInitContext) => {
                    const { getSettings, stopClient } = context!;
                    expect(isFunction(getSettings)).toBeTruthy();
                    expect(isFunction(stopClient)).toBeTruthy();
                });

            client.registerAspect(fooAspect);
            client.registerAspect(barAspect);

            return client.start().then(() => {
                expect(fooOnInitializeSpy).toHaveBeenCalled();
            });
        });

        test('onInitialize basic call with setting', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');
            const barAspect = new Aspect('bar');

            const barSettingSpy = jest.spyOn(barAspect, 'settings').mockReturnValue({ foo: 42 });

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation((context?: AspectInitContext) => {
                    const { getSettings, stopClient } = context!;
                    const r = getSettings('foo');
                    expect(r?.[0]).toBe(42);
                    expect(isFunction(stopClient)).toBeTruthy();
                });

            client.registerAspect(fooAspect);
            client.registerAspect(barAspect);

            return client.start().then(() => {
                expect(barSettingSpy).toHaveBeenCalled();
                expect(fooOnInitializeSpy).toHaveBeenCalled();
            });
        });

        test('onInitialize stopClient', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation((context?: AspectInitContext) => ({
                    stopOnStart: context!.stopClient
                }));

            const fooOnStart = jest.spyOn(fooAspect, 'onStart')
                .mockImplementation((context?: AspectStartContext) => {
                    const ctx = context as unknown as Record<string, Record<string, () => Promise<void>>>;
                    ctx.foo.stopOnStart()
                        .then(() => {
                            expect(client.isRunning()).toBe(false);
                            expect(client.isStarted()).toBe(false);
                            expect(client.isStopping()).toBe(false);
                            expect(client.isStopped()).toBe(true);
                        });

                    expect(client.isRunning()).toBe(false);
                    expect(client.isStarted()).toBe(false);
                    expect(client.isStopping()).toBe(true);
                    expect(client.isStopped()).toBe(false);
                });

            const fooOnStop = jest.spyOn(fooAspect, 'onStop');

            client.registerAspect(fooAspect);

            return client.start().then(() => {
                expect(client.isRunning()).toBe(false);
                expect(client.isStarted()).toBe(false);
                expect(client.isStopping()).toBe(false);
                expect(client.isStopped()).toBe(true);

                expect(fooOnInitializeSpy).toHaveBeenCalled();
                expect(fooOnStart).toHaveBeenCalled();
                expect(fooOnStop).toHaveBeenCalled();
            });
        });

        test('context', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation((context?: AspectInitContext) => ({
                    answer: 42,
                    callForAnswer: () => {
                        expect((context!.getAspect('foo') as Record<string, number>).answer).toBe(42);
                    }
                }));

            const fooOnStart = jest.spyOn(fooAspect, 'onStart')
                .mockImplementation((context?: AspectStartContext) => {
                    const ctx = context as unknown as Record<string, Record<string, unknown>>;
                    expect(ctx.foo.answer).toBe(42);
                    (ctx.foo.callForAnswer as () => void)();
                });

            client.registerAspect(fooAspect);

            return client.start().then(() => {
                expect(fooOnInitializeSpy).toHaveBeenCalled();
                expect(fooOnStart).toHaveBeenCalled();
            });
        });
    });
});
