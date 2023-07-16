import Aspect from './aspect';

describe('Aspect', () => {
    describe('Constructor', () => {
        test('No id provided', () => {
            const toThrow = () => new Aspect();

            expect(toThrow).toThrow('An Aspect must have an id.');
        });

        test('Id provided', () => {
            const aspectId = 'foo';

            const aspect = new Aspect(aspectId);

            expect(aspect.id).toBe(aspectId);
        });
    });

    test('hooks returns null', () => {
        const aspect = new Aspect('foo');

        expect(aspect.hooks()).toBe(null);
    });

    test('getControls returns null', () => {
        const aspect = new Aspect('foo');

        expect(aspect.getControls()).toBe(null);
    });

    test('onInitialize does nothing', () => {
        const aspect = new Aspect('foo');

        expect(aspect.onInitialize()).toBe(undefined);
    });

    test('onStart does nothing', () => {
        const aspect = new Aspect('foo');

        expect(aspect.onStart()).toBe(undefined);
    });

    test('onStop does nothing', () => {
        const aspect = new Aspect('foo');

        expect(aspect.onStop()).toBe(undefined);
    });
});