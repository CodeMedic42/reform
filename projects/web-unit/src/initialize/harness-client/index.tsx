import React from 'react';
import { createRoot } from 'react-dom/client';
import HarnessRoot from './harness-root.js';
import ErrorBoundary from './error-boundary.js';

declare global {
    /* eslint-disable no-var, vars-on-top */
    var healthCheck: () => string;
    var React: typeof import('react');
    /* eslint-enable no-var, vars-on-top */
}

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    // eslint-disable-next-line no-console
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

global.healthCheck = (): string => 'healthy';
global.React = React;

function docReady(fn: () => void): void {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

docReady(() => {
    const container = document.getElementsByClassName('web-unit-app-root')[0];
    const root = createRoot(container);
    root.render(
        <ErrorBoundary>
            <HarnessRoot />
        </ErrorBoundary>,
    );
});
