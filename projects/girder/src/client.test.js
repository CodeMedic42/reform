/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import isFunction from 'lodash/isFunction';
import Client from './client';
import Aspect from './aspect';

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

        const proms = [];

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

        const toThrow = () => client.registerAspect(foo2);

        expect(toThrow).toThrow('An aspect with the id "foo" already exists.');

        return promise;
    });

    test('Register Aspect after start', async () => {
        const client = new Client();

        client.start();

        const toThrow = () => client.registerAspect(new Aspect('foo'));

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
                .mockImplementation(({ hooks, getContext, stopClient }) => {
                    expect(hooks.length).toBe(0);
                    expect(isFunction(getContext)).toBeTruthy();
                    expect(isFunction(stopClient)).toBeTruthy();
                });

            client.registerAspect(fooAspect);
            client.registerAspect(barAspect);

            return client.start().then(() => {
                expect(fooOnInitializeSpy).toHaveBeenCalled();
            });
        });

        test('onInitialize basic call with hook', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');
            const barAspect = new Aspect('bar');

            const barHookSpy = jest.spyOn(barAspect, 'hooks').mockReturnValue({ foo: 42 });

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation(({ hooks, getContext, stopClient }) => {
                    expect(hooks?.[0]).toBe(42);
                    expect(isFunction(getContext)).toBeTruthy();
                    expect(isFunction(stopClient)).toBeTruthy();
                });

            client.registerAspect(fooAspect);
            client.registerAspect(barAspect);

            return client.start().then(() => {
                expect(barHookSpy).toHaveBeenCalled();
                expect(fooOnInitializeSpy).toHaveBeenCalled();
            });
        });

        test('onInitialize stopClient', async () => {
            const client = new Client();

            const fooAspect = new Aspect('foo');

            const fooOnInitializeSpy = jest.spyOn(fooAspect, 'onInitialize')
                .mockImplementation(({ stopClient }) => ({
                    stopOnStart: stopClient
                }));

            const fooOnStart = jest.spyOn(fooAspect, 'onStart')
                .mockImplementation((context) => {
                    context.foo.stopOnStart()
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
                .mockImplementation(({ getContext }) => ({
                    answer: 42,
                    callForAnswer: () => {
                        expect(getContext().foo.answer).toBe(42);
                    }
                }));

            const fooOnStart = jest.spyOn(fooAspect, 'onStart')
                .mockImplementation((context) => {
                    expect(context.foo.answer).toBe(42);
                    context.foo.callForAnswer();
                });

            client.registerAspect(fooAspect);

            return client.start().then(() => {
                expect(fooOnInitializeSpy).toHaveBeenCalled();
                expect(fooOnStart).toHaveBeenCalled();
            });
        });
    });
});