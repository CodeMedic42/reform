import React, { ReactNode } from 'react';
import { createStore, combineReducers, Reducer, Store, Action } from 'redux';
import { Provider } from 'react-redux';
import { isNil, isEmpty, keys, forEach } from 'lodash-es';
import { Aspect, type AspectInitContext, type AspectSettings } from '@reformjs/girder';

type CombineCallback = (reducers: Record<string, Reducer>) => Reducer;

interface ReduxSetting {
    reducers?: Record<string, Reducer>;
}

interface ReduxAspectResult {
    getState: (...args: unknown[]) => unknown;
    dispatch: (action: Action) => Action;
}

class ReduxAspect extends Aspect {
    private combineCallback: CombineCallback;

    private store!: Store;

    constructor(combineCallback: CombineCallback = combineReducers) {
        super('redux');

        this.combineCallback = combineCallback;
    }

    settings(): AspectSettings | null {
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

    onInitialize(config?: AspectInitContext): ReduxAspectResult {
        const {
            getSettings,
        } = config!;

        const settings = getSettings('redux') as ReduxSetting[];

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
            // @typescript-eslint/no-unused-vars
            getState: (..._args: unknown[]): unknown => store.getState(),
            dispatch: (...args: [Action]): Action => store.dispatch(...args),
        };
    }
}

export default ReduxAspect;
