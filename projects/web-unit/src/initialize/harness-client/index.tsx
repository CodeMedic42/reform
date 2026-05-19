import React from 'react';
import ReactDOM from 'react-dom';
import HarnessRoot from './harness-root.js';
import ErrorBoundary from './error-boundary.js';

declare global {
    var healthCheck: () => string;
    var React: typeof import('react');
}

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
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
    ReactDOM.render(
        (
            <ErrorBoundary>
                <HarnessRoot />
            </ErrorBoundary>
        ),
        document.getElementsByClassName('web-unit-app-root')[0],
    );
});
