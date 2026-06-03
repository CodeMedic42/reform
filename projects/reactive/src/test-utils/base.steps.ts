// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'vitest';
import { toNumber, map } from 'lodash-es';
// eslint-disable-next-line import/no-extraneous-dependencies
import { userEvent } from 'vitest/browser';
import type { HarnessControl } from './harness.js';

interface StepCallbackDefinition {
    (name: string, fn: (...args: any[]) => any): void;
}

interface StepControls {
    Step: StepCallbackDefinition;
}

export function baseStepDefinitions(
    { Step }: StepControls,
    harness: HarnessControl,
): void {
    // --- Property setters (generic — matches Given/When/And) ---

    Step('the {string} property is set to {string}', async (_ctx: any, propId: string, propValue: string) => {
        await harness.setProps({ [propId]: propValue });
    });

    Step('the {string} property is set to null', async (_ctx: any, propId: string) => {
        await harness.setProps({ [propId]: null });
    });

    Step('the {string} property is set to undefined', async (_ctx: any, propId: string) => {
        await harness.setProps({ [propId]: undefined });
    });

    Step('the {string} property is set to true', async (_ctx: any, propId: string) => {
        await harness.setProps({ [propId]: true });
    });

    Step('the {string} property is set to false', async (_ctx: any, propId: string) => {
        await harness.setProps({ [propId]: false });
    });

    Step('the {string} property is set to a string collection of:', async (_ctx: any, propId: string, table: any[]) => {
        const stringItems = map(table, (item) => item.values);
        await harness.setProps({ [propId]: stringItems });
    });

    Step('the {string} property is set to a numeric collection of:', async (_ctx: any, propId: string, table: any[]) => {
        const numericItems = map(table, (item) => toNumber(item.values));
        await harness.setProps({ [propId]: numericItems });
    });

    Step('the {string} property is set to a collection of:', async (_ctx: any, propId: string, table: any[]) => {
        await harness.setProps({ [propId]: table });
    });

    // --- Property changes ---

    Step('the {string} property is changed to null', async (_ctx: any, propId: string) => {
        await harness.setProps({ [propId]: null });
    });

    Step('the {string} property is changed to {string}', async (_ctx: any, propId: string, propValue: string) => {
        await harness.setProps({ [propId]: propValue });
    });

    // --- Keyboard ---

    Step('{string} key is pressed {int} times', async (_ctx: any, key: string, times: number) => {
        for (let i = 0; i < times; i++) {
            await userEvent.keyboard(`{${key}}`);
        }
    });

    // --- Mouse ---

    Step('the root element is clicked {int} times', async (_ctx: any, times: number) => {
        const el = harness.getRootElement();
        for (let i = 0; i < times; i++) {
            await userEvent.click(el);
        }
    });

    // --- Text content ---

    Step('the {string} element has text {string}', (_ctx: any, selector: string, text: string) => {
        const el = harness.selectElement(selector);
        expect(el).toBeTruthy();
        expect(el!.textContent).toContain(text);
    });

    Step('the {string} element from body has text {string}', (_ctx: any, selector: string, text: string) => {
        const el = harness.selectElementFromBody(selector);
        expect(el).toBeTruthy();
        expect(el!.textContent).toContain(text);
    });

    Step('the {string} element does not have text {string}', (_ctx: any, selector: string, text: string) => {
        const el = harness.selectElement(selector);
        expect(el).toBeTruthy();
        expect(el!.textContent).not.toContain(text);
    });

    // --- Element existence ---

    Step('the {string} element should exist', (_ctx: any, selector: string) => {
        const el = harness.selectElement(selector);
        expect(el).toBeTruthy();
    });

    Step('the {string} element should not exist', (_ctx: any, selector: string) => {
        const el = harness.selectElement(selector);
        expect(el).toBeFalsy();
    });

    Step('the {string} element from body has element {string}', (_ctx: any, parentSelector: string, childSelector: string) => {
        const parent = harness.selectElementFromBody(parentSelector);
        expect(parent).toBeTruthy();
        const child = parent!.querySelector(childSelector);
        expect(child).toBeTruthy();
    });

    // --- CSS classes (from body) ---

    Step('the {string} element from body has class {string}', (_ctx: any, selector: string, className: string) => {
        const el = harness.selectElementFromBody(selector);
        expect(el).toBeTruthy();
        expect(el!.classList.contains(className)).toBe(true);
    });

    Step('the {string} element from body does not have class {string}', (_ctx: any, selector: string, className: string) => {
        const el = harness.selectElementFromBody(selector);
        expect(el).toBeTruthy();
        expect(el!.classList.contains(className)).toBe(false);
    });
}
