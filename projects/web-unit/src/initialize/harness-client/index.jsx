import React from 'react';
import ReactDOM from 'react-dom';
import HarnessRoot from './harness-root';
import ErrorBoundary from './error-boundary';

window.addEventListener('unhandledrejection', (event) => {
    // eslint-disable-next-line no-console
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

global.healthCheck = () => 'healthy';
global.React = React;

function docReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

docReady(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(
        (
            <ErrorBoundary>
                <HarnessRoot />
            </ErrorBoundary>
        ),
        document.getElementsByClassName('web-unit-app-root')[0],
    );
});


