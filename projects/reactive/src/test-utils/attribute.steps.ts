// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'vitest';
import type { HarnessControl } from './harness.js';

interface StepCallbackDefinition {
    (name: string, fn: (...args: any[]) => any): void;
}

interface StepControls {
    Step: StepCallbackDefinition;
}

function getElementAttribute(el: Element, attrName: string): string | null {
    // For DOM properties like className, id, textContent — read from the property
    if (attrName in el) {
        return (el as any)[attrName]?.toString() ?? null;
    }
    // Fall back to HTML attribute
    return el.getAttribute(attrName);
}

export function attributeStepDefinitions(
    { Step }: StepControls,
    harness: HarnessControl,
): void {
    // --- From Body ---

    Step('the {string} element from body has attribute {string} which is {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElementFromBody(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).toBe(attrValue);
        },
    );

    Step('the {string} element from body has attribute {string} which contains {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElementFromBody(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).toContain(attrValue);
        },
    );

    Step('the {string} element from body has attribute {string} which is not {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElementFromBody(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).not.toBe(attrValue);
        },
    );

    Step('the {string} element from body has attribute {string} which does not contain {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElementFromBody(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).not.toContain(attrValue);
        },
    );

    // --- Root Element ---

    Step('the root element has attribute {string} which is {string}',
        (_ctx: any, attrName: string, attrValue: string) => {
            const el = harness.getRootElement();
            const observed = getElementAttribute(el, attrName);
            expect(observed).toBe(attrValue);
        },
    );

    Step('the root element has attribute {string} which contains {string}',
        (_ctx: any, attrName: string, attrValue: string) => {
            const el = harness.getRootElement();
            const observed = getElementAttribute(el, attrName);
            expect(observed).toContain(attrValue);
        },
    );

    Step('the root element has attribute {string} which has a value',
        (_ctx: any, attrName: string) => {
            const el = harness.getRootElement();
            const observed = getElementAttribute(el, attrName);
            expect(typeof observed === 'string' && observed.length > 0).toBeTruthy();
        },
    );

    Step('the root element has attribute {string} which does not contain {string}',
        (_ctx: any, attrName: string, attrValue: string) => {
            const el = harness.getRootElement();
            const observed = getElementAttribute(el, attrName);
            expect(observed).not.toContain(attrValue);
        },
    );

    Step('the root element does not have attribute {string}',
        (_ctx: any, attrName: string) => {
            const el = harness.getRootElement();
            expect(el.hasAttribute(attrName)).toBe(false);
        },
    );

    // --- Sub Element ---

    Step('the {string} element has attribute {string} which has a value',
        (_ctx: any, selector: string, attrName: string) => {
            const el = harness.selectElement(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(typeof observed === 'string' && observed.length > 0).toBeTruthy();
        },
    );

    Step('the {string} element has attribute {string} which is {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElement(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).toBe(attrValue);
        },
    );

    Step('the {string} element has attribute {string} which contains {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElement(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).toContain(attrValue);
        },
    );

    Step('the {string} element has attribute {string} which does not contain {string}',
        (_ctx: any, selector: string, attrName: string, attrValue: string) => {
            const el = harness.selectElement(selector);
            expect(el).toBeTruthy();
            const observed = getElementAttribute(el!, attrName);
            expect(observed).not.toContain(attrValue);
        },
    );
}
