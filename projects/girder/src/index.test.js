import Client, { Aspect } from './index';
import ClientDirect from './client';
import AspectDirect from './aspect';

describe('Index', () => {
    test('Client is Client', async () => {
        expect(Client).toBe(ClientDirect);
    });

    test('Aspect is Aspect', async () => {
        expect(Aspect).toBe(AspectDirect);
    });
});