// eslint-disable-next-line import/no-unresolved
import React, { ReactNode } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createStore, combineReducers, Reducer, Store, Action } from 'redux';
// eslint-disable-next-line import/no-unresolved
import { Provider } from 'react-redux';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';

type CombineCallback = (reducers: Record<string, Reducer>) => Reducer;

interface ReduxSetting {
    reducers?: Record<string, Reducer>;
}

interface ReduxConfig {
    getSettings: (key: string) => ReduxSetting[];
}

interface ReduxAspectResult {
    getState: (...args: unknown[]) => unknown;
    dispatch: (action: Action) => Action;
}

interface AspectSettings {
    react: Array<{
        Component: React.ComponentType<{ children: ReactNode }>;
    }>;
}

class ReduxAspect extends Aspect {
    private combineCallback: CombineCallback;
    private store!: Store;

    constructor(combineCallback: CombineCallback = combineReducers) {
        super('redux');

        this.combineCallback = combineCallback;
    }

    settings(): AspectSettings {
        return {
            react: [{
                Component: ({ children }: { children: ReactNode }) => (
                    <Provider store={this.store}>
                        {children}
                    </Provider>
                )
            }]
        };
    }

    onInitialize(config: ReduxConfig): ReduxAspectResult {
        const {
            getSettings,
        } = config;

        const settings: ReduxSetting[] = getSettings('redux');

        const reducers: Record<string, Reducer> = {};

        forEach(settings, (setting: ReduxSetting) => {
            const aspectReducers: Record<string, Reducer> | undefined = setting.reducers;

            if (isNil(aspectReducers)) {
                return;
            }

            forEach(aspectReducers, (aspectReducer: Reducer, id: string) => {
                if (!isNil(reducers[id])) {
                    throw new Error(`A reducer by the id of ${id} already exists.`);
                }

                reducers[id] = aspectReducer;
            });
        });

        if (isEmpty(keys(reducers))) {
            throw new Error('At least one reducer is needed to use Redux');
        }

        const store: Store = createStore(this.combineCallback(reducers));

        this.store = store;

        return {
            getState: (...args: unknown[]): unknown => store.getState(),
            dispatch: (...args: [Action]): Action => store.dispatch(...args),
        };
    }
}

export default ReduxAspect;
