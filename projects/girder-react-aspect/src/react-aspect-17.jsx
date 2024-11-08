import React from 'react';
// eslint-disable-next-line react/no-deprecated
import ReactDom, { unmountComponentAtNode } from 'react-dom';
import Promise from 'bluebird';
import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import { Aspect } from '@reformjs/girder';
import girderReactContext from './girder-react-context';

function build(aspectComponents, root) {
    return reduce(
        aspectComponents,
        (acc, Component) => (
                <Component>
                    {acc}
                </Component>
            ),
        root
    );
}

class ReactAspect extends Aspect {
    constructor(aspectId, RootComponent) {
        super(aspectId);

        this.RootComponent = RootComponent;
        this.container = null;
        this.root = null;
        this.aspectComponents = [];
    }

    onInitialize(config) {
        this.aspectComponents = [];

        const hooks = config.getHooks('react');

        forEach(hooks, (hook, hookId) => {
            if (hookId !== '*' && hookId !== this.id) {
                return;
            }

            const { Component } = hook;

            if (isNil(Component)) {
                return;
            }

            this.aspectComponents.push(Component);
        });
    }

    onStart(systemContext) {
        super.onStart(systemContext);

        const mountId = `${this.id}-container`;

        let container = document.getElementById(mountId);

        if (!isNil(container)) {
            throw new Error(`An element with id ${mountId} already exists`);
        }

        container = document.createElement('div');

        this.container = container;

        container.setAttribute('id', mountId);

        document.body.appendChild(container);

        const { RootComponent } = this;

        const useAspect = (aspectId) => systemContext[aspectId];

        const useAction = (action, ...args) =>
             Promise
                .try(() => action(systemContext, ...args))
                // Swallow everything, the dev should get data from the store.
                // The only thing they should know is the action finished.
                .then(noop)
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });

        const reactContext = {
            useAspect,
            useAction,
        };

        const appRoot = (
            <girderReactContext.Provider value={reactContext}>
                {build(this.aspectComponents, <RootComponent />)}
            </girderReactContext.Provider>
        );

        ReactDom.render(appRoot, container);
    }

    onStop() {
        super.stop();

        unmountComponentAtNode(this.container);

        this.container.remove();
        this.container = null;
    }
}

export default ReactAspect;