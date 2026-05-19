import React from 'react';
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, PANEL_ID } from './constants';
import { ConfigPanel } from './ConfigPanel';

addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
        type: types.PANEL,
        title: 'Config',
        render: ({ active }) => <ConfigPanel active={active} />,
    });
});
