/* eslint-disable class-methods-use-this */
import React from 'react';
import Promise from 'bluebird';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import noop from 'lodash/noop';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
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

class ReactAspectBase extends Aspect {
    constructor(aspectId, RootComponent) {
        super(aspectId);

        this.RootComponent = RootComponent;
        this.container = null;
        this.root = null;
        this.aspectComponents = [];
    }

    onInitialize(config) {
        this.aspectComponents = [];

        const settings = config.getSettings('react');

        forEach(settings, (setting) => {
            let componentDefinitions = setting;

            if (!isArray(componentDefinitions)) {
                componentDefinitions = [componentDefinitions];
            }

            forEach(componentDefinitions, (componentDefinition) => {
                const {
                    target,
                    Component,
                } = componentDefinition ?? [];

                if (isNil(Component)) {
                    return;
                }

                let match = false;

                if (target instanceof RegExp) {
                    match = target.test(this.id);
                } else if (target === this.id) {
                    match = true;
                } else if (isNil(target)) {
                    match = true;
                }

                if (match) {
                    this.aspectComponents.push(Component);
                }
            });
        });
    }

    mount() {
        throw new Error('A React Aspect must have a mount method');
    }

    unmount() {
        throw new Error('A React Aspect must have an unmount method');
    }

    onStart(girderContext) {
        super.onStart(girderContext);

        const mountId = `${this.id}-container`;

        let container = document.getElementById(mountId);

        if (!isNil(container)) {
            throw new Error(`An element with id ${mountId} already exists`);
        }

        container = document.createElement('div');

        this.container = container;

        container.setAttribute('id', mountId);

        document.body.appendChild(container);

        const useAspect = (aspectId) => girderContext.getAspect(aspectId);

        const useAction = (action, ...args) => {
            if (!isFunction(action)) {
                throw new Error('useAction must be provided a function.');
            }

            return Promise
                .try(() => action(girderContext, ...args))
                // Swallow everything, the dev should get data from the store.
                // The only thing they should know is the action finished.
                .then(noop)
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
            };

        const reactContext = {
            useAspect,
            useAction,
        };

        const { RootComponent } = this;

        const appRoot = (
            <girderReactContext.Provider value={reactContext}>
                {build(this.aspectComponents, <RootComponent />)}
            </girderReactContext.Provider>
        );

        this.mount(this.container, appRoot);
    }

    onStop() {
        super.stop();

        this.unmount(this.container);

        this.container.remove();
        this.container = null;
    }
}

export default ReactAspectBase;