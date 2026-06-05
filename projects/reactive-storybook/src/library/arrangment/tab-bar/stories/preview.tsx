import React, { useMemo, useState } from 'react';
import TabBar, { TabBottom } from '@reformjs/reactive/arrangement/tab-bar';
import Page, { PageContent } from '@reformjs/reactive/arrangement/page';
import Card from '@reformjs/reactive/arrangement/card';

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

interface PreviewProps {
    exampleTabHeading: string;
    exampleTabDisabled: boolean;
    withBottom: boolean;
    [key: string]: unknown;
}

function preview(props: PreviewProps) {
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
        <Page>
            <PageContent>
                <TabBar
                    {...rest}
                    tabs={tabs}
                    value={selectedTab}
                    onChange={setSelectedTab}
                />
                {
                    withBottom
                        ?
                        // <TabBottom>
                        //     <div style={{ whiteSpace: 'nowrap' }}>
                        //         {`Selected tab is: ${selectedTab} Super long text that continues to demonstrate the behavior of the TabBottom component when the text is excessively long.`}
                        //     </div>
                        // </TabBottom>
                        <Card>
                            <div style={{ whiteSpace: 'nowrap' }}>
                                <span style={{
                                    padding: '0 8px',
                                    position: 'sticky',
                                    left: 'var(--sticky-left-offset)',
                                    background: 'violet',
                                    boxSizing: 'content-box'
                                }}><span>Page Contents</span></span>
                                <span style={{ padding: '0 8px', background:'blue', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
                                <span style={{ padding: '0 8px', background:'red', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
                                <span style={{ padding: '0 8px', background:'green', boxSizing: 'content-box' }}><span>Content that is long enough to test overflow behavior</span></span>
                            </div>
                        </Card>
                        : null
                }
            </PageContent>
        </Page>
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
