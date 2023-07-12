import React from 'react';
import ReactDOM from 'react-dom';
import isNil from 'lodash/isNil';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import { Aspect } from '@reform/girder-client';
import systemContext from './context';

const { Provider } = systemContext;

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

    onInitialize(context) {
        super.onInitialize(context);

        this.aspectComponents = [];

        forEach(context.hooks.react, (hook) => {
            const { Component } = hook;

            if (isNil(Component)) {
                return;
            }

            this.aspectComponents.push(Component);
        });
    }

    onStart(context) {
        super.onStart(context);

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

        const appRoot = (
            <Provider value={context}>
                {build(this.aspectComponents, <RootComponent />)}
            </Provider>
        );

        import('react-dom/client')
            .then((client) => {
                this.root = client.createRoot(container);

                this.root.render(appRoot);
            })
            .catch(() => {
                ReactDOM.render(appRoot, container);
            });
    }

    onStop() {
        super.stop();

        if (!isNil(this.root)) {
            this.root.unmount();

            this.root = null;
        } else {
            ReactDOM.unmountComponentAtNode(this.container);
        }

        this.container.remove();

        this.container = null;
    }
}

export default ReactAspect;