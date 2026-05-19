import React from 'react';
import { render, cleanup } from 'vitest-browser-react/pure';

type RenderResult = Awaited<ReturnType<typeof render>>;

export interface HarnessControl {
    renderHarness: (Component: React.ComponentType<any>, props?: Record<string, any>) => Promise<void>;
    setProps: (props: Record<string, any>) => Promise<void>;
    getRootElement: () => Element;
    selectElement: (selector: string) => Element | null;
    selectElementFromBody: (selector: string) => Element | null;
    selectAllFromBody: (selector: string) => NodeListOf<Element>;
    cleanup: () => Promise<void>;
}

export function createHarnessControl(): HarnessControl {
    let screen: RenderResult | null = null;
    let currentProps: Record<string, any> = {};
    let CurrentComponent: React.ComponentType<any> | null = null;

    return {
        async renderHarness(Component, props = {}) {
            CurrentComponent = Component;
            currentProps = props;
            screen = await render(<Component {...props} />);
        },

        async setProps(props) {
            currentProps = { ...currentProps, ...props };
            if (screen && CurrentComponent) {
                await screen.rerender(<CurrentComponent {...currentProps} />);
            }
        },

        getRootElement() {
            if (!screen) throw new Error('Harness not rendered. Call renderHarness() first.');
            const el = screen.container.firstElementChild;
            if (!el) throw new Error('No root element found in rendered component.');
            return el;
        },

        selectElement(selector: string) {
            if (!screen) throw new Error('Harness not rendered. Call renderHarness() first.');
            return screen.container.firstElementChild!.querySelector(selector);
        },

        selectElementFromBody(selector: string) {
            return document.querySelector(selector);
        },

        selectAllFromBody(selector: string) {
            return document.querySelectorAll(selector);
        },

        async cleanup() {
            await cleanup();
            screen = null;
            currentProps = {};
            CurrentComponent = null;
        },
    };
}
