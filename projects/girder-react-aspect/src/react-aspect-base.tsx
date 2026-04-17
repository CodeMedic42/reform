/* eslint-disable class-methods-use-this */
import React, { type ComponentType, type ReactNode } from 'react';
import Promise from 'bluebird';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import noop from 'lodash/noop';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import isFunction from 'lodash/isFunction';
import { Aspect } from '@reformjs/girder';
import girderReactContext from './girder-react-context.js';
import type { GirderContext, GirderReactContextValue, ActionFunction } from './girder-react-context.js';

interface ComponentDefinition {
    target?: string | RegExp | null;
    Component?: ComponentType<{ children?: ReactNode }>;
}

interface InitConfig {
    getSettings: (key: string) => (ComponentDefinition | ComponentDefinition[])[];
}

function build(aspectComponents: ComponentType<{ children?: ReactNode }>[], root: ReactNode): ReactNode {
    return reduce(
        aspectComponents,
        (acc: ReactNode, Component: ComponentType<{ children?: ReactNode }>) => (
            <Component>
                {acc}
            </Component>
        ),
        root
    );
}

class ReactAspectBase extends Aspect {
    RootComponent: ComponentType;
    container: HTMLDivElement | null;
    root: unknown;
    aspectComponents: ComponentType<{ children?: ReactNode }>[];

    constructor(aspectId: string, RootComponent: ComponentType) {
        super(aspectId);

        this.RootComponent = RootComponent;
        this.container = null;
        this.root = null;
        this.aspectComponents = [];
    }

    onInitialize(config: InitConfig): void {
        this.aspectComponents = [];

        const settings = config.getSettings('react');

        forEach(settings, (setting: ComponentDefinition | ComponentDefinition[]) => {
            let componentDefinitions: ComponentDefinition[];

            if (!isArray(setting)) {
                componentDefinitions = [setting as ComponentDefinition];
            } else {
                componentDefinitions = setting;
            }

            forEach(componentDefinitions, (componentDefinition: ComponentDefinition) => {
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

    mount(_container: HTMLDivElement, _appRoot: ReactNode): void {
        throw new Error('A React Aspect must have a mount method');
    }

    unmount(_container: HTMLDivElement): void {
        throw new Error('A React Aspect must have an unmount method');
    }

    onStart(girderContext: GirderContext): void {
        super.onStart(girderContext);

        const mountId = `${this.id}-container`;

        let container = document.getElementById(mountId);

        if (!isNil(container)) {
            throw new Error(`An element with id ${mountId} already exists`);
        }

        container = document.createElement('div');

        this.container = container as HTMLDivElement;

        container.setAttribute('id', mountId);

        document.body.appendChild(container);

        const useAspect = (aspectId: string): unknown => girderContext.getAspect(aspectId);

        const useAction: GirderReactContextValue['useAction'] = (action: ActionFunction, ...args: unknown[]): Promise<void> => {
            if (!isFunction(action)) {
                throw new Error('useAction must be provided a function.');
            }

            return Promise
                .try(() => action(girderContext, ...args))
                // Swallow everything, the dev should get data from the store.
                // The only thing they should know is the action finished.
                .then(noop)
                .catch((err: unknown) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
            };

        const reactContext: GirderReactContextValue = {
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

    onStop(): void {
        super.stop();

        this.unmount(this.container!);

        this.container!.remove();
        this.container = null;
    }
}

export default ReactAspectBase;
