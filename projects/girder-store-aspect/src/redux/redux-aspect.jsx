// eslint-disable-next-line import/no-unresolved
import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { createStore, combineReducers } from 'redux';
// eslint-disable-next-line import/no-unresolved
import { Provider } from 'react-redux';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import { Aspect } from '@reformjs/girder';

class ReduxAspect extends Aspect {
    constructor(combineCallback = combineReducers) {
        super('redux');

        this.combineCallback = combineCallback;
    }

    settings() {
        return {
            react: [{
                // eslint-disable-next-line react/prop-types
                Component: ({ children }) => (
                    <Provider store={this.store}>
                        {children}
                    </Provider>
                )
            }]
        };
    }

    onInitialize(config) {
        const {
            getSettings,
        } = config;

        const settings = getSettings('redux');

        const reducers = {};

        forEach(settings, (setting) => {
            const aspectReducers = setting.reducers;

            if (isNil(aspectReducers)) {
                return;
            }

            forEach(aspectReducers, (aspectReducer, id) => {
                if (!isNil(reducers[id])) {
                    throw new Error(`A reducer by the id of ${id} already exists.`);
                }

                reducers[id] = aspectReducer;
            });
        });

        if (isEmpty(keys(reducers))) {
            throw new Error('At least one reducer is needed to use Redux');
        }

        const store = createStore(this.combineCallback(reducers));

        return {
            getState: (...args) => store(...args),
            dispatch: (...args) => store.dispatch(...args),
        };
    }
}

export default ReduxAspect;