import Client, { Aspect } from './index.js';
import ClientDirect from './client.js';
import AspectDirect from './aspect.js';

describe('Index', () => {
    test('Client is Client', async () => {
        expect(Client).toBe(ClientDirect);
    });

    test('Aspect is Aspect', async () => {
        expect(Aspect).toBe(AspectDirect);
    });
});
