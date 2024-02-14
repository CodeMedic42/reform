/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import TabBar, { TabBottom } from '@reformjs/reactive/arrangement/tab-bar';

const exampleTabs = [
    {
        id: 'tabB',
        heading: 'Example Tab B',
    },
    {
        id: 'tabC',
        heading: 'Example Tab C',
        disabled: true,
    },
];

function preview(props) {
    const {
        exampleTabHeading,
        exampleTabDisabled,
        withBottom,
        ...rest
    } = props;

    const [selectedTab, setSelectedTab] = useState('tabA');

    const tabs = useMemo(() => [
        {
            id: 'tabA',
            heading: exampleTabHeading,
            disabled: exampleTabDisabled,
        },
        ...exampleTabs,
    ], [exampleTabHeading, exampleTabDisabled]);

    return (
        <>
            <TabBar
                {...rest}
                tabs={tabs}
                value={selectedTab}
                onChange={setSelectedTab}
            />
            {
                withBottom
                    ? <TabBottom>{`Selected tab is: ${selectedTab}`}</TabBottom>
                    : null
            }
        </>
    );
}

preview.storyName = 'Preview';
preview.parameters = {
    options: {
        showPanel: true,
    },
};
preview.args = {
    exampleTabHeading: 'Example Tab A',
    exampleTabDisabled: false,
    disabled: false,
    withBottom: false,
};
preview.argTypes = {
    id: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    className: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    exampleTabHeading: {
        control: 'text',
        table: {
            defaultValue: { summary: 'null' },
        },
    },
    exampleTabDisabled: {
        control: 'boolean',
        table: {
            defaultValue: { summary: false },
        },
    },
    disabled: {
        control: 'boolean',
        table: {
            defaultValue: { summary: false },
        },
    },
    withBottom: {
        control: 'boolean',
        table: {
            defaultValue: { summary: false },
        },
    },
    onChange: { table: { disable: true } },
};

export default preview;
