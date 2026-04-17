import { jest } from '@jest/globals';

let wrapper = null;

global.beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
});

global.afterEach(() => {
    if (wrapper === null || wrapper === undefined) {
        return;
    }

    wrapper.detach();

    wrapper = null;
});
